import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesTypes } from './categories-types.entity';
import { IsNull, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { GetCategoryType } from './dto/get-types';

@Injectable()
export class CategoriesTypesService {
  constructor(
    @InjectRepository(CategoriesTypes)
    private categoriesTypesRepository: Repository<CategoriesTypes>,
    private readonly i18n: I18nService,
  ) {}
  async getCategoriesTypes(query: { typeId: string }, lang?: string) {
    const categories = await this.categoriesTypesRepository.find({
      where: {
        parent: {
          id: query.typeId ? query.typeId : IsNull(),
        },
      },
      relations: ['children'],
    });

    // Добавляем переводы
    return this.mapWithTranslations(categories, lang);
  }
  private async mapWithTranslations(
    categories: CategoriesTypes[],
    lang?: string,
  ): Promise<GetCategoryType[]> {
    return Promise.all(
      categories.map(async (category) => ({
        id: category.id,
        name: this.i18n.t(`types.${category.type}`),
        type: category.type,
        children: category.children
          ? await this.mapWithTranslations(category.children, lang)
          : [],
      })),
    );
  }
  async getTypeById(id: string) {
    return await this.categoriesTypesRepository.findOne({
      relations: ['children'],
      where: {
        id,
      },
    });
  }
}
