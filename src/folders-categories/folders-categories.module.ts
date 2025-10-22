import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderCategory } from './folder-category.entity';
import { FoldersCategoriesController } from './folders-categories.controller';
import { FoldersCategoriesService } from './folders-categories.service';
import { UsersCategoriesModule } from 'src/users_categories/users-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([FolderCategory]), UsersCategoriesModule],
  controllers: [FoldersCategoriesController],
  providers: [FoldersCategoriesService],
  exports: [FoldersCategoriesService],
})
export class FoldersCategoriesModule {}
