import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { UserLearningStrickModule } from 'src/user-learning-strick/user-learning-strick.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UsersCategories]),
    UserLearningStrickModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
