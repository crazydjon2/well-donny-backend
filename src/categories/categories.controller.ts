import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Card } from 'src/cards/card.entity';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get('categories/:id')
  getCategoryById(@Param() params): Promise<Category | null> {
    return this.categoriesService.getCategoryById(params.id);
  }

  @Get('categories/:id/cards')
  getCategoryCards(@Param() params): Promise<Card[]> {
    return this.categoriesService.getCategoryCards(params.id);
  }

  //   @Get('users/:id')
  //   getUserById(@Param() params): string {
  //     return this.userService.getUserById(params.id);
  //   }

  @Post('categories/create')
  createCategory(@Body() CreateUserDto) {
    return this.categoriesService.createCategory(CreateUserDto);
  }
}
