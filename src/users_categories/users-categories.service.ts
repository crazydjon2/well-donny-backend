import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UserRole, UsersCategories } from './users-categories.entity';

@Injectable()
export class UsersCategoriesService {
  constructor(
    @InjectRepository(UsersCategories)
    private readonly userCategoryRepo: Repository<UsersCategories>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
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

  async getCategoriesByUser(userId?: string, type?: string, role?: UserRole) {
    const where: {
      user: { id?: string };
      role?: UserRole;
      category?: { categoriesTypes: { id: string } };
    } = { user: { id: userId } };

    // Добавляем role если указано
    if (role !== undefined && role !== null) {
      where.role = role;
    }

    // Добавляем фильтр по типу категории если указано
    if (type) {
      where.category = { categoriesTypes: { id: type } };
    }

    return this.userCategoryRepo.find({
      where,
      relations: ['category', 'user', 'category.categoriesTypes'],
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
}
