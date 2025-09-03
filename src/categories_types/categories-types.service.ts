import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesTypes } from './categories-types.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesTypesService {
  constructor(
    @InjectRepository(CategoriesTypes)
    private categoriesTypesRepository: Repository<CategoriesTypes>,
  ) {}
  getCategoriesTypes() {
    return this.categoriesTypesRepository.find();
  }
  async getTypeById(id: string) {
    return await this.categoriesTypesRepository.findOne({
      where: {
        id,
      },
    });
  }
}
