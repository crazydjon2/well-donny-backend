import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { UsersCategoriesService } from './users-categories.service';
import { UserRole } from './users-categories.entity';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('user-categories')
export class UserCategoryController {
  constructor(private readonly service: UsersCategoriesService) {}

  @Post('/add')
  async addCategoryToUser(@Body() dto: { userId: string; categoryId: string }) {
    return this.service.addCategoryToUser(
      dto.userId,
      dto.categoryId,
      UserRole.VIEWER,
    );
  }

  @Post('/remove')
  async removeCategoryFromUser(
    @Body() dto: { userId: string; categoryId: string },
  ) {
    return this.service.removeCategoryFromUser(dto.userId, dto.categoryId);
  }

  @Get(':userId')
  async getCategories(@Param('userId') userId: string) {
    return this.service.getCategoriesByUser(userId);
  }

  @Put('/mark-as-done')
  async markAsDone(
    @Body() dto: { categoryId: string },
    @UserId() user_id: string,
  ) {
    return this.service.markAsDone(user_id, dto.categoryId);
  }

  @Put('/rate')
  async rateCategory(
    @UserId() userId: string,
    @Body() dto: { rate: number; categoryId: string },
  ) {
    return this.service.rateCategory(userId, dto);
  }
}
