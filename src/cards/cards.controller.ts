import { Body, Controller, Post } from '@nestjs/common';
import { Card } from './card.entity';
import { CardsService } from './cards.service';

@Controller()
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Post('/cards/create')
  createCard(@Body() CreateCardDto): Promise<Card> {
    return this.cardService.createCard(CreateCardDto);
  }
}
