import { Controller, Get } from '@nestjs/common';
import { CategoriesTypes } from './categories-types.entity';
import { CategoriesTypesService } from './categories-types.service';

@Controller('categories-types')
export class CategoriesTypesController {
  constructor(private categoriesTypesService: CategoriesTypesService) {}

  @Get()
  getCategoriesType(): Promise<CategoriesTypes[]> {
    return this.categoriesTypesService.getCategoriesTypes();
  }
}
