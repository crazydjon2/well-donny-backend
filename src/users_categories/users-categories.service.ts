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

  async setCardsPosition(userId: string, categoryId: string, position: number) {
    const uc = await this.userCategoryRepo.findOne({
      where: {
        category: {
          id: categoryId,
        },
        user: {
          id: userId,
        },
      },
    });
    if (uc) {
      uc.cardPosition = position;
      return await this.userCategoryRepo.save(uc);
    }
  }

  async getAvgRate(categoryId: string) {
    const uc = await this.userCategoryRepo.find({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
    if (uc.length) {
      const rates = uc
        .map((uc) => uc.rate)
        .filter((r): r is number => r !== null && r !== undefined);

      const avgRate =
        rates.length > 0
          ? Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1))
          : null;
      return avgRate;
    }
    return null;
  }

  async getAuthor(categoryId: string) {
    const uc = await this.userCategoryRepo.findOne({
      where: {
        category: {
          id: categoryId,
        },
        role: UserRole.CREATOR,
      },
      relations: ['user'],
    });
    return uc?.user;
  }
}
