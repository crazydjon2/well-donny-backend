import { Body, Controller, Delete, Post } from '@nestjs/common';
import { Card } from './card.entity';
import { CardsService } from './cards.service';
import { CreateCardDto, DeleteCardDto } from './dto';
import { DeleteResult } from 'typeorm';

@Controller()
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Post('/cards/create')
  createCard(@Body() CreateCardDto: CreateCardDto): Promise<Card> {
    return this.cardService.createCard(CreateCardDto);
  }

  @Delete('/cards/delete')
  deleteCard(@Body() DeleteCardDto: DeleteCardDto): Promise<DeleteResult> {
    return this.cardService.deleteCard(DeleteCardDto.ids);
  }
}
