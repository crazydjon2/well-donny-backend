import { UserLearningStrick } from 'src/user-learning-strick/user-learning-strick.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tg_id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UsersCategories, (uc) => uc.user)
  userCategories: UsersCategories[];

  @OneToMany(() => UserLearningStrick, (ulc) => ulc.id)
  userLearningStrick: UserLearningStrick;
}
