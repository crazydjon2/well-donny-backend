import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestWord } from './test-words.entity';
import { TestWordsController } from './test-words.controller';
import { TestWordService } from './test-words.service';
import { Card } from 'src/cards/card.entity';
import { Word } from 'src/words/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestWord, Card, Word])],
  controllers: [TestWordsController],
  providers: [TestWordService],
})
export class TestWordsModule {}
