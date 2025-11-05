import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @ManyToOne(() => User, (u) => u.id)
  user: User;

  @ManyToMany(() => Category, (c) => c.folders)
  @JoinTable()
  categories: Category[];
}
