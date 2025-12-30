import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CategoryDTO, CreateCategoryDto } from './dto';
import { DeleteResult } from 'typeorm';
import { EditCategoryDto } from './dto/edit.category.dto';
import { GetByType, GetByTypeDTO } from './dto/get-by-type.dto';
import { GetCategories, GetCategoriesDTO } from './dto/get-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all')
  getAllCategories(
    @Query()
    query: GetCategoriesDTO,
  ): Promise<GetCategories[] | null> {
    return this.categoriesService.getAllCategories(query);
  }

  @Get('/by-type')
  getCategoriesByType(
    @Query()
    query: GetByTypeDTO,
  ): Promise<GetByType[]> {
    return this.categoriesService.getByType(
      query.typeId,
      query.name,
      query.page,
      query.size,
    );
  }

  @Get(':id')
  getCategoryById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryDTO | null> {
    return this.categoriesService.getCategoryById(id);
  }

  @Put(':id')
  editCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() categoryDTO: EditCategoryDto,
  ): Promise<CategoryDTO | null> {
    return this.categoriesService.editCategory(categoryDTO);
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
