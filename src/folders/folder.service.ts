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
    return await this.folderRepository.save({
      name: body.name,
      user: {
        id: userId,
      },
      categories: body.categories.map((c) => {
        return {
          id: c,
        };
      }),
    });
  }

  async editFolder(
    userId: string,
    body: { name: string; categories: string[]; id: string },
  ) {
    return await this.folderRepository.save({
      id: body.id,
      name: body.name,
      categories: body.categories.map((c) => {
        return {
          id: c,
        };
      }),
    });
  }

  async deleteFolder(id: string) {
    return this.folderRepository.delete(id);
  }

  async getFolder(id: string) {
    const folder = await this.folderRepository.findOne({
      where: {
        id,
      },
      relations: {
        categories: true
      }
    });

    return folder;
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
