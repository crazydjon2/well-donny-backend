import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesTypesService } from './categories-types.service';
import { I18nLang } from 'nestjs-i18n';
import { GetCategoryType } from './dto/get-types';

@Controller('categories-types')
export class CategoriesTypesController {
  constructor(private categoriesTypesService: CategoriesTypesService) {}

  @Get()
  getCategoriesType(
    @Query() query: { typeId: string },
    @I18nLang() lang: string,
  ): Promise<GetCategoryType[]> {
    return this.categoriesTypesService.getCategoriesTypes(query, lang);
  }
}
