import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeleteResult, Repository } from 'typeorm';
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
import { User } from 'src/users/user.entity';
import {
  CategoriesTypes,
  CategoryType,
} from 'src/categories_types/categories-types.entity';
import { RawUserCategoryResult } from './dto/get-category-raw-type';

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

  // categories.service.ts

  async getByType(
    typeId: string,
    name: string,
  ): Promise<Record<string, { id: string; items: UsersCategories[] }>> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.userCategories', 'uc')
      .leftJoinAndSelect('uc.user', 'user')
      .leftJoinAndSelect('category.categoriesTypes', 'categoriesTypes')
      .leftJoinAndSelect('categoriesTypes.children', 'children')
      .where('uc.role = :role', { role: UserRole.CREATOR })
      .andWhere(
        new Brackets((qb) => {
          qb.where('categoriesTypes.id = :typeId', { typeId }).orWhere(
            'categoriesTypes.parent.id = :typeId',
            { typeId },
          );
        }),
      );

    // Добавляем фильтр по name если он передан
    if (name) {
      query.andWhere('category.name ILIKE :name', { name: `%${name}%` });
    }

    const result: RawUserCategoryResult[] = await query
      .select([
        'uc.id as id',
        'uc.role as role',
        'uc.completionсount as completionCount',
        'uc.createdAt as createdAt',
        'uc.updatedAt as updatedAt',
        'uc.rate as rate',
        'user.id as userId',
        'user.tg_id as userTgId',
        'user.name as userName',
        'user.createdAt as userCreatedAt',
        'user.updatedAt as userUpdatedAt',
        'category.id as categoryId',
        'category.name as categoryName',
        'category.description as categoryDescription',
        'category.createdAt as categoryCreatedAt',
        'category.updatedAt as categoryUpdatedAt',
        'categoriesTypes.id as typeId',
        'categoriesTypes.type as typeName',
        `(SELECT AVG(uc2.rate) FROM users_categories uc2 WHERE uc2.category_id = category.id) as averageRate`,
        `ROW_NUMBER() OVER (PARTITION BY categoriesTypes.type ORDER BY category.name ASC) as row_num`,
      ])
      .orderBy('categoriesTypes.type', 'ASC')
      .addOrderBy('category.name', 'ASC')
      .getRawMany();

    // Фильтруем только первые 10 записей для каждого типа
    const filteredResult = result.filter((item) => item.row_num <= 10);

    // Группируем по типам категорий с правильной типизацией
    const grouped: Record<string, { id: string; items: UsersCategories[] }> =
      filteredResult.reduce(
        (
          acc: Record<string, { id: string; items: UsersCategories[] }>,
          item: RawUserCategoryResult,
        ) => {
          const typeName = item.typename;

          if (!acc[typeName]) {
            acc[typeName] = {
              id: item.typeid,
              items: [],
            };
          }

          // Создаем UsersCategories
          const userCategory = new UsersCategories();
          userCategory.id = item.id;
          userCategory.role = item.role as UserRole;
          userCategory.completionСount = item.completionсount;
          userCategory.createdAt = item.createdat;
          userCategory.updatedAt = item.updatedat;
          userCategory.rate = item.rate;

          // Создаем User
          userCategory.user = new User();
          userCategory.user.id = item.userid;
          userCategory.user.tg_id = +item.usertgid;
          userCategory.user.name = item.username;
          userCategory.user.createdAt = item.usercreatedat;
          userCategory.user.updatedAt = item.userupdatedat;

          // Создаем Category
          userCategory.category = new Category();
          userCategory.category.id = item.categoryid;
          userCategory.category.name = item.categoryname;
          userCategory.category.description = item.categorydescription;
          userCategory.category.createdAt = item.categorycreatedat;
          userCategory.category.updatedAt = item.categoryupdatedat;

          // Создаем CategoriesTypes для category
          userCategory.category.categoriesTypes = new CategoriesTypes();
          userCategory.category.categoriesTypes.id = item.typeid;
          userCategory.category.categoriesTypes.type =
            item.typename as CategoryType;
          userCategory.category.categoriesTypes.children = item.children;

          // Добавляем averageRate как дополнительное поле (не часть entity)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          userCategory.averageRate = item.averagerate
            ? parseFloat(item.averagerate)
            : null;

          acc[typeName].items.push(userCategory);

          return acc;
        },
        {},
      );

    return grouped;
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
