import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { Card } from 'src/cards/card.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateCategoryDto } from './dto';

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
  createCategory(
    @UserId() user_id: string,
    @Body() categoryDTO: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory(categoryDTO, user_id);
  }
