import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLearningStrick } from './user-learning-strick.entity';
import { UserLearningStrickService } from './user-learning-strick.service';
import { UserLearningStrickController } from './user-learning-strick.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserLearningStrick])],
  controllers: [UserLearningStrickController],
  providers: [UserLearningStrickService],
  exports: [UserLearningStrickService],
})
export class UserLearningStrickModule {}
