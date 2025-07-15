import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UsersCategories } from './users-categories.entity';

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

  async addCategoryToUser(userId: string, categoryId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const category = await this.categoryRepo.findOneBy({ id: categoryId });

    if (!user || !category) {
      throw new NotFoundException('User or category not found');
    }

    const userCategory = this.userCategoryRepo.create({ user, category });
    return this.userCategoryRepo.save(userCategory);
  }

  async getCategoriesByUser(userId: string) {
    return this.userCategoryRepo.find({
      where: { user: { id: userId } },
      relations: ['category'],
    });
  }
}
