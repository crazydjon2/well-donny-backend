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

  isfavorite: number | null;

  testword_isanswered: boolean | null;
  testword_failiercounter: number | null;
  testword_successcounter: number | null;
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
      return this.cardRepository.find({
        relations: ['word'],
        where: { category: { id: categoryId } },
      });
    }

    const query = this.cardRepository
      .createQueryBuilder('card')
      .leftJoin('card.word', 'word')
      .leftJoin('card.category', 'category')

      // статистика
      .leftJoin(
        'test_words',
        'testword',
        `
    testword.word_id = word.id
    AND testword.user_id = :userId
    AND testword.category_id::uuid = :categoryId
  `,
        { userId, categoryId },
      )

      // избранное
      .leftJoin(
        'favorite_words',
        'fw',
        'fw.word_id = word.id AND fw.user_id = :userId',
        { userId },
      )

      .where('category.id = :categoryId', { categoryId })

      .select([
        'card.id AS card_id',

        'word.id AS word_id',
        'word.original AS word_original',
        'word.translated AS word_translated',

        'fw.word_id AS isFavorite',

        'testword.isAnswered AS testword_isanswered',
        'testword.failierCounter AS testword_failiercounter',
        'testword.successCounter AS testword_successcounter',
      ])

      .orderBy('word.createdAt', 'DESC');

    const raw: CardRaw[] = await query.getRawMany();

    return raw.map((row) => ({
      id: row.card_id,
      word: {
        id: row.word_id,
        original: row.word_original,
        translated: row.word_translated,
        isFavorite: !!row.isfavorite,
      },
      stats: {
        isAnswered: row.testword_isanswered ?? false,
        failierCounter: row.testword_failiercounter ?? 0,
        successCounter: row.testword_successcounter ?? 0,
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
