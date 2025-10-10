import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

export enum UserRole {
  CREATOR = 'creator',
  VIEWER = 'viewer',
}

@Entity('users_categories')
@Unique(['user', 'category']) // Предотвращает дубли
export class UsersCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CREATOR,
  })
  role: UserRole;

  @Column({
    default: 0,
  })
  completionСount: number;

  @ManyToOne(() => User, (user) => user.userCategories, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, (category) => category.userCategories, {
    onDelete: 'CASCADE',
  })
  category: Category;
}
