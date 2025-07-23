import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsModule } from 'src/words/words.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), WordsModule],
  exports: [CardsService],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
