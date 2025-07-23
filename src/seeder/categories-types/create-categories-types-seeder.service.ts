import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoriesTypes,
  CategoryType,
} from 'src/categories_types/categories-types.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateCategoriesTypesSeederService {
  constructor(
    @InjectRepository(CategoriesTypes)
    private categoriesTypesRepository: Repository<CategoriesTypes>,
  ) {}

  async seed() {
    const existing = await this.categoriesTypesRepository.count();
    if (existing === 0) {
      const types = [
        { type: CategoryType.LANGUAGE },
        { type: CategoryType.SIENCE },
      ];
      const result = await this.categoriesTypesRepository.save(types);
      return result;
    }
    return this.categoriesTypesRepository.find();
  }
}
