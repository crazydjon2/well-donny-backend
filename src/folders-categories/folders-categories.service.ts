import { Injectable } from '@nestjs/common';
import { FolderCategory } from './folder-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FoldersCategoriesService {
  constructor(
    @InjectRepository(FolderCategory)
    private folderCategoryRepository: Repository<FolderCategory>,
  ) {}

  async createFolderCategories(
    userId: string,
    folder: string,
    categories: string[],
  ) {
    const folderCategoriesData = categories.map((c) => {
      return {
        folder: {
          id: folder,
        },
        category: {
          id: c,
        },
      };
    });

    return await this.folderCategoryRepository.save(folderCategoriesData);
  }

  async getCategoriesByFolder(folderId: string) {
    const result: {
      fc_id: string;
      fc_category_id: string;
      fc_folder_id: string;
    }[] = await this.folderCategoryRepository
      .createQueryBuilder('fc')
      .innerJoin('fc.category', 'c')
      .where('fc.folder.id = :folderId', { folderId })
      .getRawMany();

    return result.map((r) => {
      return {
        id: r.fc_id,
        category: {
          id: r.fc_category_id,
        },
        folder: {
          id: r.fc_folder_id,
        },
      };
    });
  }
}
