import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CreateUsersSeederService } from './users/create-users-seeder.service';
import { SeederService } from './seeder.service';
import { CreateCategoriesSeederService } from './categories/create-categories-seeder.service';
import { Category } from 'src/categories/category.entity';
import { CreateUsersCategoriesSeederService } from './users-categories/create-users-categories.service';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { CreateWordsSeederService } from './words/create-words.service';
import { Word } from 'src/words/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, UsersCategories, Word])],
  providers: [CreateUsersSeederService, SeederService, CreateCategoriesSeederService, CreateUsersCategoriesSeederService, CreateWordsSeederService],
  exports: [SeederService],
})
export class SeederModule {}