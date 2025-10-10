import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { TestWordService } from './test-words.service';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { PutWordDTO } from './dto/put-word.dto';

@Controller('test')
export class TestWordsController {
  constructor(private readonly testWordService: TestWordService) {}

  @Put('update-word')
  putWord(@UserId() user_id: string, @Body() dto: Omit<PutWordDTO, 'userId'>) {
    return this.testWordService.addWord({
      ...dto,
      userId: user_id,
    });
  }

  @Get(':categoryId')
  getTestRound(
    @UserId() user_id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.testWordService.getTestRound(user_id, categoryId);
  }

  @Get(':categoryId/progress')
  getTestProgress(
    @UserId() user_id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.testWordService.getTestProgress(user_id, categoryId);
  }
  @Get(':categoryId/restart')
  restartTest(
    @UserId() user_id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.testWordService.restartTest(user_id, categoryId);
  }
}
