import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto';
import { Card } from 'src/cards/card.entity';
import { CardsService } from 'src/cards/cards.service';
import { Request } from 'express';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import { UserService } from 'src/users/users.service';
import { UsersCategories } from 'src/users_categories/users-categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
    private userService: UserService,
  ) {}

  async getAllCategories(
    req: Request & { tg_id: number },
  ): Promise<UsersCategories[] | null> {
    if (req.headers.authorization) {
      const tg_id: number = req.tg_id;
      const user = await this.userService.getUser(tg_id);
      if (user) {
        const usersCategories =
          await this.usersCategoriesService.getCategoriesByUser(user.id);

        return usersCategories;
      }

      // TODO Error handeling (mb Auth Guard)
      return null;
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

  createCategory(categoryDTO: CreateCategoryDto) {
    const res = this.categoryRepository.save(categoryDTO);
    return res;
  }
}
