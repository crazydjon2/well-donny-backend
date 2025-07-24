import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { CreateCategoryDto } from 'src/categories/dto';
import { Card } from 'src/cards/card.entity';
import { Word } from 'src/words/word.entity';

@Injectable()
export class CreateCardsSeederService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  async seed(categories: Category[], words: Word[]): Promise<Card[]> {
    categories.forEach((category: Category, index) => {
        this.cardRepo.save({category, word: words[index]})
    })
    return []
  }
}
