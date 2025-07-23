import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto';
import { Word } from './word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { EditWordDto } from './dto/editWord.dto';

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
  async editWord(word: EditWordDto): Promise<UpdateResult> {
    return await this.wordRepository.update(word.id, {
      original: word.original,
      translated: word.translated,
    });
  }
  async deleteWord(ids: string[]): Promise<DeleteResult> {
    console.log(ids);
    return await this.wordRepository.delete(ids);
  }
}
