import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesTypes } from './categories-types.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CategoriesTypesService {
  constructor(
    @InjectRepository(CategoriesTypes)
    private categoriesTypesRepository: Repository<CategoriesTypes>,
  ) {}
  getCategoriesTypes(query: { typeId: string }) {
    return this.categoriesTypesRepository.find({
      where: {
        parent: {
          id: query.typeId ? query.typeId : IsNull(),
        },
      },
      relations: ['children'],
    });
  }
  async getTypeById(id: string) {
    return await this.categoriesTypesRepository.findOne({
      where: {
        id,
      },
    });
  }
}
