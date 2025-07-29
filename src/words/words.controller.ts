import { Body, Controller, Delete, Put } from '@nestjs/common';
import { WordsService } from './words.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import type { DeleteWordDto, UpdateWordDto } from './dto';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsServie: WordsService) {}

  @Put('update')
  updateWord(@Body() updateWordDto: UpdateWordDto): Promise<UpdateResult> {
    return this.wordsServie.updateWord(updateWordDto);
  }

  @Delete('delete')
  deleteWord(@Body() DeleteWordDTO: DeleteWordDto): Promise<DeleteResult> {
    return this.wordsServie.deleteWord(DeleteWordDTO.ids);
  }
}
