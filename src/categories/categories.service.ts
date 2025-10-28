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
import { EditCategoryDto } from './dto/edit.category.dto';
import { WordsService } from 'src/words/words.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardsService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
    private categoriesTypesService: CategoriesTypesService,
    private wordsService: WordsService,
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
    sort,
    folder,
  }: {
    type: string;
    userId: string;
    role: UserRole;
    sort: 'ASC' | 'DESC';
    folder: string;
  }): Promise<UsersCategories[]> {
    return await this.usersCategoriesService.getCategoriesByUser(
      userId || undefined,
      type || undefined,
      role || undefined,
      sort || undefined,
      folder || undefined,
    );
  }

  async getByType(typeId: string) {
    return this.usersCategoriesService.getByType(typeId);
  }

  async getCategoryById(id: string): Promise<CategoryDTO | null> {
    const category = await this.categoryRepository.findOne({
      relations: [
        'userCategories.user',
        'categoriesTypes',
        'categoriesTypes.parent',
      ],
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

  async editCategory(categoryDTO: EditCategoryDto) {
    const type = await this.categoriesTypesService.getTypeById(
      categoryDTO.type,
    );
    if (type) {
      await this.categoryRepository.update(categoryDTO.id, {
        name: categoryDTO.name,
        description: categoryDTO.description,
        categoriesTypes: type,
      });

      const wordsToEdit = categoryDTO.words.filter(
        (word) => word.id && !word.toDelete,
      );
      const wordsToCreate = categoryDTO.words.filter((word) => !word.id);
      const wordsToDelete = categoryDTO.words.filter((word) => word.toDelete);
      if (wordsToEdit.length) {
        wordsToEdit.forEach((word) => {
          this.wordsService.updateWord(word);
        });
      }
      if (wordsToCreate.length) {
        await this.cardsService.createCards(
          wordsToCreate.map((word: CreateWordDto) => {
            return {
              category_id: categoryDTO.id,
              word_original: word.original,
              word_translated: word.translated,
            };
          }),
        );
      }
      if (wordsToDelete.length) {
        await this.wordsService.deleteWord(
          wordsToDelete.map((w) => w.id as string),
        );
      }
    }

    return null;
  }
}
