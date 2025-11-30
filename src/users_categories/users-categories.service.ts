import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { FindOperator, ILike, Repository } from 'typeorm';
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
    name?: string,
  ) {
    const where: {
      user: { id?: string };
      role?: UserRole;
      category: {
        id?: FindOperator<string>;
        categoriesTypes?: { id: string };
        folders?: { id: string }[];
      };
      sort?: 'ASC' | 'DESC';
      folders?: {
        id: string;
      }[];
      name?: FindOperator<string>;
    } = {
      user: { id: userId },
      category: {},
    };

    if (role !== undefined && role !== null) {
      where.role = role;
    }

    if (type) {
      where.category = {
        categoriesTypes: { id: type },
      };
    }

    if (folder) {
      where.category.folders = [{ id: folder }];
    }

    if (name) {
      where.name = ILike(`%${name}%`);
    }

    const userCategories = await this.userCategoryRepo.find({
      where,
      relations: [
        'category',
        'category.userCategories',
        'category.userCategories.user',
        'category.categoriesTypes',
      ],
      order: {
        updatedAt: sort || 'DESC',
      },
    });

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

  async setOrder(userId: string, categoryId: string, isReverse: boolean) {
    const category = await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: categoryId,
        },
      },
    });
    if (category) {
      category.reverseOrder = isReverse;
      return await this.userCategoryRepo.save(category);
    }
  }

  async rateCategory(
    userId: string,
    dto: { categoryId: string; rate: number },
  ) {
    const category = await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: dto.categoryId,
        },
      },
    });
    if (category) {
      category.rate = dto.rate;
      return await this.userCategoryRepo.save(category);
    }
  }

  async getUserCategory(categoryId: string, userId: string) {
    return await this.userCategoryRepo.findOne({
      where: {
        user: { id: userId },
        category: {
          id: categoryId,
        },
      },
    });
  }
}
