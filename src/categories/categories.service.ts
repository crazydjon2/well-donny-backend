import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto';
import { Card } from 'src/cards/card.entity';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardService: CardsService
  ) { }

  getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }
  getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: {
        id
      }
    })
  }
  getCategoryCards(id: string): Promise<Card[]> {
    return this.cardService.getCardsByCategory(id)
  }

  createCategory(categoryDTO: CreateCategoryDto): boolean {
    this.categoryRepository.create(categoryDTO);
    return true
  }
}
