import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestWord } from './test-words.entity';
import { Card } from 'src/cards/card.entity';
import { PutWordDTO } from './dto/put-word.dto';

@Injectable()
export class TestWordService {
  constructor(
    @InjectRepository(TestWord)
    private testWordRepository: Repository<TestWord>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async addWord(putWordDTO: PutWordDTO) {
    const existingTestWord = await this.testWordRepository.findOne({
      where: {
        user: { id: putWordDTO.userId },
        word: { id: putWordDTO.wordId },
        categoryId: putWordDTO.categoryId,
      },
    });

    if (existingTestWord) {
      // Если запись существует - обновляем
      existingTestWord.isAnswered = putWordDTO.isAnswered;
      // Можно также обновлять счетчики в зависимости от isAnswered
      if (putWordDTO.isAnswered) {
        existingTestWord.successCounter += 1;
      } else {
        existingTestWord.failierCounter += 1;
      }
      return await this.testWordRepository.save(existingTestWord);
    }

    // Если записи нет - создаем новую
    const newTestWord = this.testWordRepository.create({
      user: { id: putWordDTO.userId },
      word: { id: putWordDTO.wordId },
      categoryId: putWordDTO.categoryId,
      isAnswered: putWordDTO.isAnswered,
      failierCounter: putWordDTO.isAnswered ? 0 : 1, // Логика счетчиков
      successCounter: putWordDTO.isAnswered ? 1 : 0,
    });

    return await this.testWordRepository.save(newTestWord);
  }

  // TODO
  // MAKE IT MORE OPTIMIZED
  async getTestRound(userId: string, categoryId: string) {
    const results: {
      word_id: string;
      word_original: string;
      word_translated: string;
      testWord_id: string;
      testWord_isAnswered: boolean;
      testWord_failierCounter: number;
      testWord_successCounter: number;
    }[] = await this.cardRepository
      .createQueryBuilder('card')
      .innerJoinAndSelect('card.word', 'word')
      .leftJoinAndSelect(
        'test_words',
        'testWord',
        'testWord.word_id = word.id AND testWord.user_id = :userId',
        { userId },
      )
      .where(
        'card.category = :categoryId AND (testWord.isAnswered = false OR testWord.isAnswered is NULL) ',
        {
          categoryId,
        },
      )
      .select([
        'word.id as word_id',
        'word.original as word_original',
        'word.translated as word_translated',
        'testWord.id as testWord_id',
        'testWord.isAnswered as testWord_isAnswered',
        'testWord.failierCounter as testWord_failierCounter',
        'testWord.successCounter as testWord_successCounter',
      ])
      .orderBy(
        `
    CASE 
      WHEN "testWord"."is_answered" = false THEN 1
      WHEN "testWord"."is_answered" IS NULL THEN 2
      WHEN "testWord"."is_answered" = true THEN 3
    END
  `,
        'ASC',
      )
      .getRawMany();

    return results
      .map((data) => {
        return {
          id: data.word_id,
          original: data.word_original,
          translated: data.word_translated,
        };
      })
      .slice(0, 10);
  }

  async getTestProgress(userId: string, categoryId: string) {
    const answeredCount = await this.testWordRepository.count({
      where: {
        categoryId,
        user: {
          id: userId,
        },
        isAnswered: true,
      },
    });
    const wordsCount = await this.cardRepository.count({
      where: {
        category: {
          id: categoryId,
        },
      },
    });
    return (answeredCount / wordsCount) * 100;
  }
  async restartTest(userId: string, categoryId: string) {
    const words = await this.testWordRepository.find({
      where: {
        user: {
          id: userId,
        },
        categoryId,
      },
    });
    if (words) {
      const mappedArray = words.map((tw) => {
        return {
          ...tw,
          isAnswered: false,
        };
      });
      return this.testWordRepository.save(mappedArray);
    }
    return true;
  }
}
