import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryDTO, CreateCategoryDto } from './dto';
import { CardsService } from 'src/cards/cards.service';
import { UsersCategoriesService } from 'src/users_categories/users-categories.service';
import { UserRole } from 'src/users_categories/users-categories.entity';
import { CreateWordDto } from 'src/words/dto';
import { toGetDTO } from './mappers/category.mapper';
import { CategoriesTypesService } from 'src/categories_types/categories-types.service';
import { EditCategoryDto } from './dto/edit.category.dto';
import { WordsService } from 'src/words/words.service';
import { I18nService } from 'nestjs-i18n';
import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { GetByType } from './dto/get-by-type.dto';
import { CategoriesTypes } from 'src/categories_types/categories-types.entity';
import { GetCategories, GetCategoriesDTO } from './dto/get-categories.dto';

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
  async getAllCategories(dto: GetCategoriesDTO): Promise<GetCategories[]> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.userCategories', 'userCategories')
      .leftJoinAndSelect('category.categoriesTypes', 'categoriesTypes')
      .leftJoinAndSelect('userCategories.user', 'user');
    const { folder, userId, type, name, role, sort, page, size } = dto;

    if (userId) {
      query.andWhere(
        'EXISTS (SELECT 1 FROM users_categories uc WHERE uc.category_id = category.id AND uc.user_id = :userId)',
        { userId },
      );
    }

    if (folder) {
      query.leftJoinAndSelect('category.folders', 'folders');
      query.andWhere(':folder = folders.id', { folder });
    }

    if (type) {
      query.andWhere('categoriesTypes.id = :type', { type });
    }

    if (name) {
      query.andWhere('category.name ILIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('userCategories.role = :role', { role });
    }
    query.orderBy('category.updatedAt', sort);

    if (page !== undefined && size !== undefined) {
      query.skip(page * size);
      query.take(size);
    }

    const categories = await query.getMany();
    const result: GetCategories[] = [];
    for (const category of categories) {
      const ucRelations = category.userCategories || [];

      const currentUserRelation = userId
        ? ucRelations.find((uc) => uc.user?.id === userId)
        : null;

      const userRoleInCategory = currentUserRelation?.role || null;

      // Находим автора — первого с ролью CREATOR
      const creatorRelation = ucRelations.find(
        (uc) => uc.role === UserRole.CREATOR,
      );
      const author = creatorRelation?.user || null;

      // Считаем средний рейтинг (только где rate не null)
      const rates = ucRelations
        .map((uc) => uc.rate)
        .filter((r): r is number => r !== null && r !== undefined);

      const avgRate =
        rates.length > 0
          ? Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1))
          : null;

      result.push({
        id: category.id,
        role: userRoleInCategory,
        avgRate,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        author,
        category: {
          id: category.id,
          name: category.name,
          description: category.description || '',
          type: {
            ...category.categoriesTypes,
            name: this.i18n.t(`types.${category.categoriesTypes.type}`),
            children: undefined,
            parent: undefined,
          },
        },
      });
    }

    return result;
  }

  async getByType(
    typeId: string,
    name: string,
    page?: number,
    size?: number,
  ): Promise<GetByType[]> {
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
          categories: [],
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
          page,
          size,
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
    if (categoryDTO.words.filter((w) => !w.toDelete).length < 3) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: {
          words: [this.i18n.t('errors.validation.words.minSize')],
        },
      });
    }
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
