import { User } from 'src/users/user.entity';
import { Word } from 'src/words/word.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('test_words')
export class TestWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (u) => u.id)
  user: User;

  @ManyToOne(() => Word, (w) => w.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'word_id' })
  word: Word;

  @Column()
  categoryId: string;

  @Column()
  isAnswered: boolean;

  @Column()
  failierCounter: number;

  @Column()
  successCounter: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
