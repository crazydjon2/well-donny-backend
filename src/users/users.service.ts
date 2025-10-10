import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { UserLearningStrickService } from 'src/user-learning-strick/user-learning-strick.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UsersCategories)
    private usersCategories: Repository<UsersCategories>,
    private userLearningStrickService: UserLearningStrickService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
  getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }
  getUserByTgId(tgId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        tg_id: tgId,
      },
    });
  }
  async createUser(userDTO: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(userDTO);
  }

  async getUserProfile(userId: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (user) {
      const usersCategories = await this.usersCategories.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
      const stricks = await this.userLearningStrickService.getStricks(
        userId,
        new Date(),
      );

      let d1: Date | null;
      let d2: Date | null;
      let diffDays: number = 0;

      if (stricks.length) {
        d1 = new Date(stricks[stricks.length - 1][0]);
        d2 = new Date(stricks[stricks.length - 1][1]);

        const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

        diffDays =
          Math.floor(Math.abs(utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1; // + 1 because start day included
      }
      return {
        ...user,
        totalCompletionСount: usersCategories.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.completionСount,
          0,
        ),
        strick: diffDays,
      };
    }
  }
}
