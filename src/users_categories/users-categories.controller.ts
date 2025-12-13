import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
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

  @Get('/get/:id')
  async getUserCategoryData(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.service.getUserCategory(id, userId);
  }

  @Put('/mark-as-done')
  async markAsDone(
    @Body() dto: { categoryId: string },
    @UserId() user_id: string,
  ) {
    return this.service.markAsDone(user_id, dto.categoryId);
  }

  @Put('/set-order')
  async setOrder(
    @Body() dto: { categoryId: string; reverse: boolean },
    @UserId() user_id: string,
  ) {
    return this.service.setOrder(user_id, dto.categoryId, dto.reverse);
  }

  @Put('/rate')
  async rateCategory(
    @UserId() userId: string,
    @Body() dto: { rate: number; categoryId: string },
  ) {
    return this.service.rateCategory(userId, dto);
  }
}
