import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportedLanguage, User } from './user.entity';
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
  async editUser(
    userId: string,
    dto: {
      language: SupportedLanguage;
      isPublic: boolean;
      allowNotification: boolean;
    },
  ) {
    return await this.usersRepository.update(userId, {
      allowNotification: dto.allowNotification,
      isPublic: dto.isPublic,
      language: dto.language,
    });
  }
  async addWordToFavorite(userId: string, wordId: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoriteWords') // Указываем отношение
      .of(userId) // Указываем пользователя
      .add(wordId); // Добавляем слово
  }

  async removeWordFromFavorite(userId: string, wordId: string) {
    return await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'favoriteWords')
      .of(userId)
      .remove(wordId); // Удаляем слово
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
        new Date().toISOString(),
      );

      let diffDays: number = 0;

      if (stricks.length) {
        const [start, end] = stricks[stricks.length - 1];

        const d1 = new Date(start);
        const d2 = new Date(end);
        const today = new Date();

        const d1UTC = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const d2UTC = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
        const todayUTC = Date.UTC(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        const yesterdayUTC = todayUTC - 24 * 60 * 60 * 1000;

        if (d1UTC === todayUTC && d2UTC === todayUTC) {
          diffDays = 1;
        }
        // 2️⃣ d2 === today или вчера
        else if (d2UTC === todayUTC || d2UTC === yesterdayUTC) {
          diffDays =
            Math.floor(Math.abs(d2UTC - d1UTC) / (1000 * 60 * 60 * 24)) + 1;
        }
        // 3️⃣ d2 не вчера и не сегодня
        else {
          diffDays = 0;
        }
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
