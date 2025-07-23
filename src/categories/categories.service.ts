import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto';
import { Card } from 'src/cards/card.entity';
import { CardsService } from 'src/cards/cards.service';
import { Request } from 'express';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { CreateWordDto } from 'src/words/dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
  ) {}

  async getAllCategories(user_id: string): Promise<UsersCategories[] | null> {
    const usersCategories =
      await this.usersCategoriesService.getCategoriesByUser(user_id);

    if (usersCategories.length) {
      return usersCategories;
    }
    return null;
  }
  getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }
  getCategoryCards(id: string): Promise<Card[]> {
    return this.cardService.getCardsByCategory(id);
  }

  async createCategory(categoryDTO: CreateCategoryDto, user_id: string) {
    const category = await this.categoryRepository.save(categoryDTO);
    await this.usersCategoriesService.addCategoryToUser(user_id, category.id);
    if (categoryDTO.words.length) {
      await this.cardService.createCards(
        categoryDTO.words.map((word: CreateWordDto) => {
          return {
            category_id: category.id,
            word_original: word.original,
            word_translated: word.translated,
          };
        }),
      );
    }

    return category;
  }
}
