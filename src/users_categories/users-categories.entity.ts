import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Word } from 'src/words/word.entity';

@Entity('users_categories')
@Unique(['user', 'category', 'word']) // Предотвращает дубли
export class UsersCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Word, (word) => word.usersCategories, { onDelete: 'CASCADE' })
  word: Word;

  @ManyToOne(() => User, (user) => user.userCategories, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, (category) => category.userCategories, { onDelete: 'CASCADE' })
  category: Category;
}