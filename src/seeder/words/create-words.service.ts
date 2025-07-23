import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWordDto } from 'src/words/dto';
import { Word } from 'src/words/word.entity';

const wordsMock: CreateWordDto[] = [
  {
    original: 'aaa',
    translated: 'bbb',
  },
  {
    original: 'www',
    translated: 'vbb',
  },
  {
    original: 'egwge',
    translated: 'ewgweg',
  },
  {
    original: '111',
    translated: '222',
  },
  {
    original: 'g4g4',
    translated: 'q1q1q',
  },
  {
    original: '777',
    translated: 'ppp',
  },
];

@Injectable()
export class CreateWordsSeederService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,
  ) {}

  async seed(): Promise<Word[]> {
    const existing = await this.wordRepo.count();
    if (existing === 0) {
      const arr = wordsMock.map((word: CreateWordDto) => {
        return this.wordRepo.create(word);
      });
      const result = await this.wordRepo.save(arr);
      return result;
    }
    return this.wordRepo.find();
  }
}
