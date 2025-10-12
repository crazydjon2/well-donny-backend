import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UserLearningStrick } from './user-learning-strick.entity';

@Injectable()
export class UserLearningStrickService {
  constructor(
    @InjectRepository(UserLearningStrick)
    private userLearningStrickRepository: Repository<UserLearningStrick>,
  ) {}

  async updateStrickDate(user_id: string, date: Date) {
    const strick = await this.userLearningStrickRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    });

    if (strick.length) {
      const endDate = new Date(strick[0].endDate);
      endDate.setHours(0, 0, 0, 0);
      const checkDate: Date = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      const differenceInDays = (+checkDate - +endDate) / (1000 * 60 * 60 * 24);

      if (differenceInDays > 1) {
        return await this.userLearningStrickRepository.save({
          user: {
            id: user_id,
          },
          startDate: new Date(),
          endDate: new Date(),
        });
      } else if (differenceInDays <= 1 && differenceInDays >= 0) {
        return await this.userLearningStrickRepository.save({
          id: strick[0].id,
          endDate: new Date(),
        });
      }
    } else {
      return await this.userLearningStrickRepository.save({
        user: {
          id: user_id,
        },
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  }

  async getStricks(user_id: string, date: string) {
    const decodedDate = decodeURIComponent(date);
    const targetDate = new Date(decodedDate);

    const startDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() - 1,
      1,
    );
    const endDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 2,
      0,
    );

    const stricks = await this.userLearningStrickRepository.find({
      where: {
        user: {
          id: user_id,
        },
        startDate: Between(startDate, endDate),
      },
      relations: ['user'],
      order: {
        startDate: 'ASC',
      },
    });

    return stricks.map((st) => {
      return [st.startDate, st.endDate];
    });
  }
}
