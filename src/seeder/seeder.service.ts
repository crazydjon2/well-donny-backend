import { Injectable } from '@nestjs/common';
import { CreateUsersSeederService } from './users/create-users-seeder.service';
import { CreateCategoriesSeederService } from './categories/create-categories-seeder.service';
import { CreateUsersCategoriesSeederService } from './users-categories/create-users-categories.service';
import { CreateWordsSeederService } from './words/create-words.service';
import { CreateCardsSeederService } from './cards/create-cards-seeder.service';

@Injectable()
export class SeederService {
    constructor(
        private readonly createUsersSeederService: CreateUsersSeederService,
        private readonly createCategoriesSeederService: CreateCategoriesSeederService,
        private readonly createUsersCategoriesSeederService: CreateUsersCategoriesSeederService,
        private readonly createWordsSeederService: CreateWordsSeederService,
        private readonly createCardsSeederService: CreateCardsSeederService,
    ) { }

    async seed() {
        const users = await this.createUsersSeederService.seed()
        const categories = await this.createCategoriesSeederService.seed()
        const words = await this.createWordsSeederService.seed()

        await this.createUsersCategoriesSeederService.seed(users, categories)
        await this.createCardsSeederService.seed(categories, words)
    }
}
