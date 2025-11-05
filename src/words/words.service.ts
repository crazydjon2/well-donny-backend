import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto';
import { Word } from './word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateWordDto } from './dto/update-word.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}
  createWord(word: CreateWordDto): Promise<Word> {
    return this.wordRepository.save(word);
  }
  createWords(word: CreateWordDto[]): Promise<Word[]> {
    return this.wordRepository.save(word);
  }
  async updateWord(word: UpdateWordDto): Promise<UpdateResult | Word> {
    if (word.id) {
      return await this.wordRepository.update(word.id as string, {
        original: word.original,
        translated: word.translated,
      });
    } else {
      return await this.createWord(word);
    }
  }
  async deleteWord(ids: string[]): Promise<DeleteResult> {
    return await this.wordRepository.delete(ids);
  }
}
