import { Injectable } from '@nestjs/common';
import { FolderCategory } from './folder-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';

@Injectable()
export class FoldersCategoriesService {
  constructor(
    @InjectRepository(FolderCategory)
    private folderCategoryRepository: Repository<FolderCategory>,
    private readonly usersCategoriesService: UsersCategoriesService,
  ) {}

  async createFolderCategories(
    userId: string,
    folder: string,
    categories: string[],
  ) {
    const userCategories = (
      await this.usersCategoriesService.getCategoriesByUser(userId)
    ).filter((uc) => categories.includes(uc.category.id));

    const folderCategoriesData = userCategories.map((uc) => {
      return {
        folder: {
          id: folder,
        },
        userCategory: {
          id: uc.id,
        },
      };
    });

    return await this.folderCategoryRepository.save(folderCategoriesData);
  }

  async getCategoriesByFolder(folderId: string) {
    return this.folderCategoryRepository.find({
      where: {
        id: folderId,
      },
    });
  }
}
