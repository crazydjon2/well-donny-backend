import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import {
  UserRole,
  UsersCategories,
} from 'src/users_categories/users-categories.entity';

@Injectable()
export class CreateUsersCategoriesSeederService {
  constructor(
    @InjectRepository(UsersCategories)
    private readonly usersCategoriesRepo: Repository<UsersCategories>,
  ) {}

  async seed(users: User[], categories: Category[]) {
    const existing = await this.usersCategoriesRepo.count();
    if (existing === 0) {
      users.map((user: User, index: number) => {
        this.usersCategoriesRepo.save({
          user,
          category: categories[index],
          role: UserRole.CREATOR,
        });
        // TODO!
        // ADD VIEWERS
        // await this.usersCategoriesRepo.save({ user: users[index > users.length ? 0 : index], category: categories[index], role: UserRole.VIEWER })
      });
    }
  }
}
