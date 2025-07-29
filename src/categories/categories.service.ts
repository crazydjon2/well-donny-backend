import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDTO, CreateCategoryDto } from './dto';
import { CardsService } from 'src/cards/cards.service';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { CreateWordDto } from 'src/words/dto';
import { toGetDTO } from './mappers/category.mapper';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardsService: CardsService,
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
  async getCategoryById(id: string): Promise<CategoryDTO | null> {
    const category = await this.categoryRepository.findOne({
      relations: ['userCategories.user'],
      where: {
        id,
      },
    });
    if (category) {
      return toGetDTO(category);
    }
    return category;
  }
  deleteCategoryById(id: string): Promise<DeleteResult> {
    return this.categoryRepository.delete({ id });
  }

  async createCategory(categoryDTO: CreateCategoryDto, user_id: string) {
    const category = await this.categoryRepository.save(categoryDTO);
    await this.usersCategoriesService.addCategoryToUser(user_id, category.id);
    if (categoryDTO.words.length) {
      await this.cardsService.createCards(
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
