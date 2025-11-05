import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Card } from './card.entity';
import { WordsService } from 'src/words/words.service';
import { CreateCardDto } from './dto';

interface CardRaw {
  card_id: string;
  word_id: string;
  word_original: string;
  word_translated: string;
  isFavorite: boolean | null; // добавляем поле isFavorite
}

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private wordService: WordsService,
  ) {}
  async getCardsByCategory(categoryId: string, userId?: string) {
    if (!userId) {
      // Если userId не передан, возвращаем просто карточки без статуса избранного
      return this.cardRepository.find({
        relations: ['word'],
        where: { category: { id: categoryId } },
      });
    }

    // Используем QueryBuilder для добавления поля isFavorite
    const query = this.cardRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.word', 'word')
      .leftJoinAndSelect('card.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .addSelect((subQuery) => {
        return subQuery
          .select('1')
          .from('favorite_words', 'fw')
          .where('fw.word_id = word.id')
          .andWhere('fw.user_id = :userId', { userId })
          .limit(1);
      }, 'isFavorite');

    const result: CardRaw[] = await query.getRawMany();

    // Преобразуем raw результат в нормализованный вид
    return result.map((row) => ({
      id: row.card_id,
      word: {
        id: row.word_id,
        original: row.word_original,
        translated: row.word_translated,
        isFavorite: !!row.isFavorite, // добавляем поле isFavorite
      },
    }));
  }
  async createCard(card: CreateCardDto) {
    const word = await this.wordService.createWord({
      original: card.word_original,
      translated: card.word_translated,
    });
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
