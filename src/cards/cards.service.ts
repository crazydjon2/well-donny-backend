import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>
  ) { }

  getCardsByCategory(categoryId: string) {
    return this.cardRepository.find({
      relations: {
        word: true
      },
      where: {
        category: {
          id: categoryId
        }
      }
    })
  }
}
