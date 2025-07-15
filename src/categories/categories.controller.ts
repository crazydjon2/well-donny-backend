import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Card } from 'src/cards/card.entity';
import { Request } from 'express';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  getAllCategories(@Req() req: Request): Promise<Category[] | null> {
    return this.categoriesService.getAllCategories(req);
  }

  @Get('categories/:id')
  getCategoryById(@Param() params: { id: string }): Promise<Category | null> {
    return this.categoriesService.getCategoryById(params.id);
  }

  @Get('categories/:id/cards')
  getCategoryCards(@Param() params: { id: string }): Promise<Card[]> {
    return this.categoriesService.getCategoryCards(params.id);
  }

  //   @Get('users/:id')
  //   getUserById(@Param() params): string {
  //     return this.userService.getUserById(params.id);
  //   }

  @Post('categories/create')
  createCategory(@Body() CreateCategoryDto) {
    return this.categoriesService.createCategory(CreateCategoryDto);
  }
}
