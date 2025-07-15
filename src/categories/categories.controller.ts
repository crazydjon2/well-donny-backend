import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Card } from 'src/cards/card.entity';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('categories')
  getAllCategories(
    @Req() req: Request & { tg_id: number },
  ): Promise<Category[] | null> {
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
