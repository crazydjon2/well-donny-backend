import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto';
import { Card } from 'src/cards/card.entity';
import { CardsService } from 'src/cards/cards.service';
import { Request } from 'express';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
    private authService: AuthService,
  ) {}

  async getAllCategories(req: Request): Promise<Category[] | null> {
    if (req.headers.authorization) {
      const user = await this.authService.verifyToken(
        req.headers.authorization,
      );
      if (user) {
        const usersCategories =
          await this.usersCategoriesService.getCategoriesByUser(user.id);

        return usersCategories.map(
          (usersCategories) => usersCategories.category,
        );
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
