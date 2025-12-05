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
import { I18nService } from 'nestjs-i18n';
import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { GetByType } from './dto/get-by-type.dto';
import { CategoriesTypes } from 'src/categories_types/categories-types.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private cardsService: CardsService,
    private usersCategoriesService: UsersCategoriesService,
    private categoriesTypesService: CategoriesTypesService,
    private wordsService: WordsService,
    private i18n: I18nService,
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
    name,
  }: {
    type?: string;
    userId?: string;
    role?: UserRole;
    sort?: 'ASC' | 'DESC';
    folder?: string;
    name?: string;
  }): Promise<UsersCategories[]> {
    return await this.usersCategoriesService.getCategoriesByUser(
      userId || undefined,
      type || undefined,
      role || undefined,
      sort || undefined,
      folder || undefined,
      name,
    );
  }

  // categories.service.ts

  async getByType(typeId: string, name: string): Promise<GetByType[]> {
    const types = await this.categoriesTypesService.getTypeById(typeId);

    if (!types) {
      return [];
    }

    if (!types.children.length) {
      types.children = [
        {
          id: types.id,
          type: types.type,
          parent: new CategoriesTypes(),
          children: [],
          category: new Category(),
        },
      ];
    }

    const result = await Promise.all(
      types.children.map(async (children) => {
        const categoryType: GetCategoryType = {
          id: children.id,
          name: await this.i18n.t(`types.${children.type}`),
          type: children.type,
        };

        const items = await this.getAllCategories({
          type: children.id,
          role: UserRole.CREATOR,
          name,
        });

        // Если items пустой, возвращаем null
        if (!items.length) {
          return null;
        }

        const transformedItems = items.map((item) => ({
          ...item,
          category: {
            ...item.category,
            type: categoryType,
          },
        }));

        return {
          type: categoryType,
          items: transformedItems,
        } as GetByType;
      }),
    );

    // Фильтруем null значения
    return result.filter((item): item is GetByType => item !== null);
  }

  async getCategoryById(id: string): Promise<CategoryDTO | null> {
    const category = await this.categoryRepository.findOne({
      relations: [
        'userCategories.user',
        'userCategories',
        'categoriesTypes',
        'categoriesTypes.parent',
      ],
      where: {
        id,
      },
    });
    if (category) {
      return toGetDTO(category, this.i18n);
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
