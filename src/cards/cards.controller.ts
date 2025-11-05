import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Card } from './card.entity';
import { CardsService } from './cards.service';
import { CreateCardDto, DeleteCardDto } from './dto';
import { DeleteResult } from 'typeorm';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('create')
  createCard(@Body() CreateCardDto: CreateCardDto): Promise<Card> {
    return this.cardsService.createCard(CreateCardDto);
  }

  @Get('/by-category/:id')
  getCategoryCards(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.cardsService.getCardsByCategory(id, userId);
  }

  @Delete('delete')
  deleteCard(@Body() DeleteCardDto: DeleteCardDto): Promise<DeleteResult> {
    return this.cardsService.deleteCard(DeleteCardDto.ids);
  }
}
