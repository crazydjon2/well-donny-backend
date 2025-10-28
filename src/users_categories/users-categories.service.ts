import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { UserRole, UsersCategories } from './users-categories.entity';
import { FoldersCategoriesService } from 'src/folders-categories/folders-categories.service';

@Injectable()
export class UsersCategoriesService {
  constructor(
    @InjectRepository(UsersCategories)
    private readonly userCategoryRepo: Repository<UsersCategories>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly foldersCategoriesService: FoldersCategoriesService,
  ) {}

  async addCategoryToUser(userId: string, categoryId: string, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const category = await this.categoryRepo.findOneBy({ id: categoryId });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    const userCategory = this.userCategoryRepo.create({
      user,
      category,
      role: role || UserRole.VIEWER,
    });
    return this.userCategoryRepo.save(userCategory);
  }

  async removeCategoryFromUser(userId: string, categoryId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const category = await this.categoryRepo.findOneBy({ id: categoryId });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    return this.userCategoryRepo.delete({ user, category });
  }

  async getCategoriesByUser(
    userId?: string,
    type?: string,
    role?: UserRole,
    sort?: 'ASC' | 'DESC',
    folder?: string,
  ) {
    const where: {
      user: { id?: string };
      role?: UserRole;
      category?: {
        id?: FindOperator<string>;
        categoriesTypes?: { id: string };
      };
      sort?: 'ASC' | 'DESC';
    } = {
      user: { id: userId },
    };

    if (role !== undefined && role !== null) {
      where.role = role;
    }

    if (type) {
      where.category = { categoriesTypes: { id: type } };
    }

    if (folder) {
      const categories =
        await this.foldersCategoriesService.getCategoriesByFolder(folder);
      if (categories.length) {
        if (!where.category) {
          where.category = {};
        }
        where.category.id = In(categories.map((c) => c.category.id));
      }
    }

    const userCategories = await this.userCategoryRepo.find({
      where,
      relations: [
        'category',
        'category.userCategories',
        'category.userCategories.user', // все пользователи категории
        'category.categoriesTypes',
      ],
      order: {
        updatedAt: sort || 'DESC',
      },
    });

    console.log(userCategories, where);

    // Для каждой категории находим создателя
    return userCategories.map((uc) => {
      const creator = uc.category.userCategories.find(
        (uc) => uc.role === UserRole.CREATOR,
      )?.user;

      return {
        ...uc,
        user: creator || uc.user, // fallback на текущего user если создатель не найден
      };
    });
  }

  async getByType(typeId: string) {
    const userCategories = await this.userCategoryRepo.find({
      where: [
        {
          category: {
            categoriesTypes: {
              parent: {
                id: typeId,
              },
            },
          },
        },
        {
          category: {
            categoriesTypes: {
              id: typeId,
            },
          },
        },
      ],
      order: {
        category: {
          createdAt: 'DESC',
        },
      },
      relations: [
        'category',
        'user',
        'category.categoriesTypes',
        'category.categoriesTypes.children',
      ],
    });

    const grouped = userCategories.reduce<Record<string, UsersCategories[]>>(
      (acc, userCategory) => {
        const typeId = userCategory.category.categoriesTypes.type;

        if (!acc[typeId]) {
          acc[typeId] = [];
        }

        acc[typeId].push(userCategory);
        return acc;
      },
      {},
    );

    return grouped;
  }

  async markAsDone(userId: string, categoryId: string) {
    const category = await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: categoryId,
        },
      },
    });
    if (category) {
      category.completionСount = category.completionСount + 1;
      return await this.userCategoryRepo.save(category);
    }
  }
}
