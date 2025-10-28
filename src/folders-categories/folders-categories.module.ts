import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderCategory } from './folder-category.entity';
import { FoldersCategoriesController } from './folders-categories.controller';
import { FoldersCategoriesService } from './folders-categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([FolderCategory])],
  controllers: [FoldersCategoriesController],
  providers: [FoldersCategoriesService],
  exports: [FoldersCategoriesService],
})
export class FoldersCategoriesModule {}
