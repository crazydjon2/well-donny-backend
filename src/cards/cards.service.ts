import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Card } from './card.entity';
import { WordsService } from 'src/words/words.service';
import { CreateCardDto } from './dto';
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private wordService: WordsService,
  ) {}
  getCardsByCategory(categoryId: string) {
    return this.cardRepository.find({
      relations: {
        word: true,
      },
      where: {
        category: {
          id: categoryId,
        },
      },
    });
  }
  async createCard(card: CreateCardDto) {
    console.log(card);
    const word = await this.wordService.createWord({
      original: card.word_original,
      translated: card.word_translated,
    });
    console.log(word);
    return this.cardRepository.save({
      word,
      category: {
        id: card.category_id,
      },
    });
  }
  async createCards(cards: CreateCardDto[]) {
    const words = await this.wordService.createWords(
      cards.map((card: CreateCardDto) => {
        return {
          original: card.word_original,
          translated: card.word_translated,
        };
      }),
    );
    const cardsToSave = words.map((word, index) => {
      return this.cardRepository.create({
        word,
        category: { id: cards[index].category_id },
      });
    });

    return this.cardRepository.save(cardsToSave);
  }
  async deleteCard(ids: string[]): Promise<DeleteResult> {
    return this.cardRepository.delete(ids);
  }
}
