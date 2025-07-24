import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller()
export class CategoriesController {
      constructor(private readonly categoriesService: CategoriesService) {}
    
      @Get('categories')
      getAllCategories(): Promise<Category[]> {
        return this.categoriesService.getAllCategories();
      }
    
    //   @Get('users/:id')
    //   getUserById(@Param() params): string {
    //     return this.userService.getUserById(params.id);
    //   }
    
      @Post('category')
      createCategory(@Body() CreateUserDto): boolean {
        return this.categoriesService.createCategory(CreateUserDto)
      }
}
