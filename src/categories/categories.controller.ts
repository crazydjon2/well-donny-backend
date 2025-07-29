import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CategoryDTO, CreateCategoryDto } from './dto';
import { DeleteResult } from 'typeorm';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories(
    @UserId() user_id: string,
  ): Promise<UsersCategories[] | null> {
    return this.categoriesService.getAllCategories(user_id);
  }

  @Get(':id')
  getCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryDTO | null> {
    return this.categoriesService.getCategoryById(id);
  }

  @Delete(':id')
  deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteResult> {
    return this.categoriesService.deleteCategoryById(id);
  }

  //   @Get('users/:id')
  //   getUserById(@Param() params): string {
  //     return this.userService.getUserById(params.id);
  //   }

  @Post('create')
  createCategory(
    @UserId() user_id: string,
    @Body() categoryDTO: CreateCategoryDto,
  ) {
    return this.categoriesService.createCategory(categoryDTO, user_id);
  }
}
