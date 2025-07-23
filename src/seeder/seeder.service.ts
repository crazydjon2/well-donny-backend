import { Injectable } from '@nestjs/common';
import { CreateUsersSeederService } from './users/create-users-seeder.service';
import { CreateCategoriesSeederService } from './categories/create-categories-seeder.service';
import { CreateUsersCategoriesSeederService } from './users-categories/create-users-categories.service';
import { CreateWordsSeederService } from './words/create-words.service';
import { CreateCardsSeederService } from './cards/create-cards-seeder.service';
import { CreateCategoriesTypesSeederService } from './categories-types/create-categories-types-seeder.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly createUsersSeederService: CreateUsersSeederService,
    private readonly createCategoriesSeederService: CreateCategoriesSeederService,
    private readonly createUsersCategoriesSeederService: CreateUsersCategoriesSeederService,
    private readonly createWordsSeederService: CreateWordsSeederService,
    private readonly createCardsSeederService: CreateCardsSeederService,
    private readonly createCategoriesTypesService: CreateCategoriesTypesSeederService,
  ) {}

  async seed() {
    const users = await this.createUsersSeederService.seed();
    const types = await this.createCategoriesTypesService.seed();
    const categories = await this.createCategoriesSeederService.seed(types);
    const words = await this.createWordsSeederService.seed();

    await this.createUsersCategoriesSeederService.seed(users, categories);
    await this.createCardsSeederService.seed(categories, words);
  }
}
