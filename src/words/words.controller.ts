import { Body, Controller, Put } from '@nestjs/common';
import { WordsService } from './words.service';
import { UpdateResult } from 'typeorm';

@Controller()
export class WordsController {
  constructor(private readonly wordsServie: WordsService) {}

  @Put('/words/edit')
  editWord(@Body() EditWordDto): Promise<UpdateResult> {
    return this.wordsServie.editWord(EditWordDto);
  }
}
