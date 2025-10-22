import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { Folder } from './folder.entity';
import { FoldersCategoriesModule } from 'src/folders-categories/folders-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), FoldersCategoriesModule],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
