// user-category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersCategories } from './users-categories.entity';
import { UserCategoryController } from './users-categories.controller';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { UsersCategoriesService } from './users-categories.service';
import { FoldersCategoriesModule } from 'src/folders-categories/folders-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersCategories, User, Category]),
    FoldersCategoriesModule,
  ],
  providers: [UsersCategoriesService],
  controllers: [UserCategoryController],
  exports: [UsersCategoriesService],
})
export class UsersCategoriesModule {}
