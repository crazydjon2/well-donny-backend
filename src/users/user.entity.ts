import { Exclude, Expose } from 'class-transformer';
import { Folder } from 'src/folders/folder.entity';
import { UserLearningStrick } from 'src/user-learning-strick/user-learning-strick.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { Word } from 'src/words/word.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';

export enum SupportedLanguage {
  RUSSIAN = 'ru',
  ENGLIGN = 'en',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  tg_id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    default: SupportedLanguage.RUSSIAN,
  })
  language: SupportedLanguage;

  @Column({
    default: true,
  })
  isPublic: boolean;

  @Column({
    default: true,
  })
  allowNotification: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UsersCategories, (uc) => uc.user)
  userCategories: UsersCategories[];

  @OneToMany(() => UserLearningStrick, (ulc) => ulc.id, { onDelete: 'CASCADE' })
  userLearningStrick: UserLearningStrick;

  @OneToMany(() => Folder, (f) => f.id, { onDelete: 'CASCADE' })
  folder: Folder;

  @ManyToMany(() => Word, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'favorite_words',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'word_id', referencedColumnName: 'id' },
  })
  favoriteWords: Word[];

  @Expose({ toPlainOnly: true })
  get publicName(): string {
    if (!this.isPublic) {
      return 'User-' + Math.floor(Math.random() * 10000);
    }
    return this.name;
  }
}
