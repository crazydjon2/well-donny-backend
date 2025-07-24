import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
        constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
      ) {}
    
      getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
      }
    //   getUserById(id: number | string): string {
    //     const user = cate.find(user => +user.id === +id);
    //     return user ? JSON.stringify(user) : 'User not found';
    //   }
      createCategory(categoryDTO: CreateCategoryDto): boolean {
        this.categoryRepository.create(categoryDTO);
        return true
      }
}
