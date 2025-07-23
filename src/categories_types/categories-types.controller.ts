import { Controller, Get } from '@nestjs/common';
import { CategoriesTypes } from './categories-types.entity';
import { CategoriesTypesService } from './categories-types.service';

@Controller()
export class CategoriesTypesController {
  constructor(private categoriesTypesService: CategoriesTypesService) {}

  @Get('/categories-types')
  getCategoriesType(): Promise<CategoriesTypes[]> {
    return this.categoriesTypesService.getCategoriesTypes();
  }
}
