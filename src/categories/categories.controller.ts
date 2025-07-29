import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Card } from 'src/cards/card.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateCategoryDto } from './dto';
import { DeleteResult } from 'typeorm';
import { GetCategoryDTO } from './dto/get-category.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  getAllCategories(
    @UserId() user_id: string,
  ): Promise<UsersCategories[] | null> {
    return this.categoriesService.getAllCategories(user_id);
  }

  @Get('categories/:id')
  getCategoryById(
    @Param() params: { id: string },
  ): Promise<GetCategoryDTO | null> {
    return this.categoriesService.getCategoryById(params.id);
  }

  @Delete('categories/:id')
  deleteCategory(@Param() params: { id: string }): Promise<DeleteResult> {
    return this.categoriesService.deleteCategoryById(params.id);
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
  createCategory(
    @UserId() user_id: string,
    @Body() categoryDTO: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory(categoryDTO, user_id);
  }
}
