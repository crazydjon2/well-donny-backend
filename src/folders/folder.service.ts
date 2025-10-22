import { Injectable } from '@nestjs/common';
import { Folder } from './folder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoldersCategoriesService } from 'src/folders-categories/folders-categories.service';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    private foldersCategoriesService: FoldersCategoriesService,
  ) {}

  async createFolder(
    userId: string,
    body: { name: string; categories: string[] },
  ) {
    const folder = await this.folderRepository.save({
      name: body.name,
      user: {
        id: userId,
      },
    });

    return this.foldersCategoriesService.createFolderCategories(
      userId,
      folder.id,
      body.categories,
    );
  }

  async getFolders(userId: string) {
    return await this.folderRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}
