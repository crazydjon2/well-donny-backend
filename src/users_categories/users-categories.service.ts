import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UserRole, UsersCategories } from './users-categories.entity';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersCategoriesService {
  constructor(
    @InjectRepository(UsersCategories)
    private readonly userCategoryRepo: Repository<UsersCategories>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private i18n: I18nService,
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

  // users-categories.service.ts

  async getCategoriesByUser(
    userId?: string,
    type?: string,
    role?: UserRole,
    sort: 'ASC' | 'DESC' = 'DESC',
    folder?: string,
    name?: string,
  ): Promise<any[]> {
    const qb = this.userCategoryRepo.createQueryBuilder('uc');

    qb.leftJoinAndSelect('uc.user', 'user')
      .leftJoinAndSelect('uc.category', 'category')
      .leftJoinAndSelect('category.categoriesTypes', 'categoriesTypes')
      .leftJoinAndSelect('category.userCategories', 'allUserCategories') // все, кто в категории
      .leftJoinAndSelect('allUserCategories.user', 'categoryUser');

    // Фильтры
    if (userId) {
      qb.andWhere('uc.user_id = :userId', { userId });
    }
    if (role !== undefined && role !== null) {
      qb.andWhere('uc.role = :role', { role });
    }
    if (type) {
      qb.andWhere('categoriesTypes.id = :type', { type });
    }
    if (folder) {
      qb.innerJoinAndSelect('category.folders', 'folder');
      qb.andWhere('folder.id = :folder', { folder });
    }
    if (name) {
      qb.andWhere('category.name ILIKE :name', { name: `%${name}%` });
    }

    qb.orderBy('uc.updatedAt', sort);

    const userCategories = await qb.getMany();

    // Всё считаем в JS — просто, понятно, без ошибок
    return userCategories.map((uc) => {
      const category = uc.category;

      // Считаем средний рейтинг
      const ratings = category.userCategories
        .map((uc) => uc.rate)
        .filter((rate) => rate !== null && rate !== undefined);

      const avgRate =
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10,
            ) / 10
          : null;

      // Находим создателя
      const creatorUc = category.userCategories.find(
        (uc) => uc.role === UserRole.CREATOR,
      );
      const creator = creatorUc?.user;

      return {
        id: uc.id,
        role: uc.role,
        completionСount: uc.completionСount,
        rate: avgRate, // ← вот оно, среднее!
        ratesCount: ratings.length, // ← сколько человек оценило
        reverseOrder: uc.reverseOrder,
        createdAt: uc.createdAt,
        updatedAt: uc.updatedAt,

        user: creator || uc.user, // создатель или текущий юзер

        category: {
          id: category.id,
          name: category.name,
          description: category.description,
          folders: category.folders,
          type: {
            id: category.categoriesTypes.id,
            type: category.categoriesTypes.type,
            name: this.i18n.t(`types.${category.categoriesTypes.type}`),
          },
        },
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
