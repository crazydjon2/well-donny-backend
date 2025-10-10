import { Controller, Body, Put, Get, Query } from '@nestjs/common';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { UserLearningStrickService } from './user-learning-strick.service';

@Controller('user-learning-strick')
export class UserLearningStrickController {
  constructor(
    private readonly userLearningStrickService: UserLearningStrickService,
  ) {}

  @Put()
  updateStrick(@UserId() user_id: string, @Body() body: { date: Date }) {
    return this.userLearningStrickService.updateStrickDate(user_id, body.date);
  }

  @Get()
  getStrick(@UserId() user_id: string, @Query() query: { date: string }) {
    return this.userLearningStrickService.getStricks(
      user_id,
      new Date(query.date),
    );
  }
}
