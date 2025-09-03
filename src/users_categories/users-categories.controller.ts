import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersCategoriesService } from './users-categories.service';
import { UserRole } from './users-categories.entity';

@Controller('user-categories')
export class UserCategoryController {
  constructor(private readonly service: UsersCategoriesService) {}

  @Post()
  async addCategoryToUser(@Body() dto: { userId: string; categoryId: string }) {
    return this.service.addCategoryToUser(
      dto.userId,
      dto.categoryId,
      UserRole.VIEWER,
    );
  }

  @Get(':userId')
  async getCategories(@Param('userId') userId: string) {
    return this.service.getCategoriesByUser(userId);
  }
}
