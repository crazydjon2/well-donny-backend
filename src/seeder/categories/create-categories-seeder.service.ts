import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { CreateCategoryDto } from 'src/categories/dto';

const categoriesMock: CreateCategoryDto[] = [
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

  async seed(): Promise<Category[]> {
    const existing = await this.categoryRepo.count();
    if (existing === 0) {
      const arr = categoriesMock.map((user: CreateCategoryDto) => {
        return this.categoryRepo.create(user);
      });
      const result = await this.categoryRepo.save(arr);
      console.log('✅ Seeded categories');
      return result;
    }
    return this.categoryRepo.find();
  }
}
