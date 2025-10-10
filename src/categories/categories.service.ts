import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDTO, CreateCategoryDto } from './dto';
import { CardsService } from 'src/cards/cards.service';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import {
  UserRole,
  UsersCategories,
} from 'src/users_categories/users-categories.entity';
import { CreateWordDto } from 'src/words/dto';
import { toGetDTO } from './mappers/category.mapper';
import { CategoriesTypesService } from 'src/categories_types/categories-types.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardsService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
    private categoriesTypesService: CategoriesTypesService,
  ) {}

  async getUsersCategories(user_id: string): Promise<UsersCategories[] | null> {
    const usersCategories =
      await this.usersCategoriesService.getCategoriesByUser(user_id);

    if (usersCategories.length) {
      return usersCategories;
    }
    return null;
  }
  async getAllCategories({
    type,
    userId,
    role,
  }: {
    type: string;
    userId: string;
    role: UserRole;
  }): Promise<UsersCategories[]> {
    return await this.usersCategoriesService.getCategoriesByUser(
      userId || undefined,
      type || undefined,
      role || UserRole.CREATOR,
    );
  }
  async getCategoryById(id: string): Promise<CategoryDTO | null> {
    const category = await this.categoryRepository.findOne({
      relations: ['userCategories.user', 'categoriesTypes'],
      where: {
        id,
      },
    });
    if (category) {
      return toGetDTO(category);
    }
    return null;
  }
  deleteCategoryById(id: string): Promise<DeleteResult> {
    return this.categoryRepository.delete({ id });
  }

  async createCategory(categoryDTO: CreateCategoryDto, user_id: string) {
    const type = await this.categoriesTypesService.getTypeById(
      categoryDTO.type,
    );
    if (type) {
      const category = await this.categoryRepository.save({
        ...categoryDTO,
        categoriesTypes: type,
      });
      await this.usersCategoriesService.addCategoryToUser(
        user_id,
        category.id,
        UserRole.CREATOR,
      );
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
      return null;
    }

    return null;
  }
}
