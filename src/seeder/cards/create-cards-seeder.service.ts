import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { Card } from 'src/cards/card.entity';
import { Word } from 'src/words/word.entity';

@Injectable()
export class CreateCardsSeederService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
  ) {}

  async seed(categories: Category[], words: Word[]): Promise<Card[]> {
    const existing = await this.cardRepo.count();
    if (existing === 0) {
      const cardsToCreate = categories.map((category: Category, index) => {
        return this.cardRepo.create({
          category,
          word: words[index],
        });
      });
      return this.cardRepo.save(cardsToCreate);
    }
    return [];
  }
}
