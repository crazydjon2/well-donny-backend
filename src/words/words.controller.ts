import { Body, Controller, Delete, Put } from '@nestjs/common';
import { WordsService } from './words.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import type { DeleteWordDto, EditWordDto } from './dto';

@Controller()
export class WordsController {
  constructor(private readonly wordsServie: WordsService) {}

  @Put('/words/edit')
  editWord(@Body() EditWordDto: EditWordDto): Promise<UpdateResult> {
    return this.wordsServie.editWord(EditWordDto);
  }

  @Delete('/words/delete')
  deleteWord(@Body() DeleteWordDTO: DeleteWordDto): Promise<DeleteResult> {
    return this.wordsServie.deleteWord(DeleteWordDTO.ids);
  }
}
