import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { CreateCategoryDto } from 'src/categories/dto';
import { CategoriesTypes } from 'src/categories_types/categories-types.entity';

const categoriesMock: { name: string }[] = [
  { name: 'Baba' },
  { name: 'Laba' },
  { name: 'Vaba' },
  { name: 'Daba' },
];

@Injectable()
export class CreateCategoriesSeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async seed(types: CategoriesTypes[]): Promise<Category[]> {
    const existing = await this.categoryRepo.count();
    if (existing === 0) {
      const arr = categoriesMock.map(
        (category: CreateCategoryDto, index: number) => {
          return this.categoryRepo.create({
            ...category,
            categoriesTypes: index % 2 === 0 ? types[0] : types[1],
          });
        },
      );
      const result = await this.categoryRepo.save(arr);
      return result;
    }
    return this.categoryRepo.find();
  }
}
