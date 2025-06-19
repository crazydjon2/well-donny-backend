import { Category } from 'src/categories/category.entity';
import { Word } from 'src/words/word.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (c) => c.id)
  category: Category

  @ManyToOne(() => Word, (w) => w.id)
  word: Word
}