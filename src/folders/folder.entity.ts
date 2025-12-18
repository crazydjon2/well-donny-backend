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
  @IsNotEmpty({ message: 'i18n::errors.validation.name.required' })
  name: string;

  @ManyToOne(() => User, (u) => u.id)
  user: User;

  @ManyToMany(() => Category, (c) => c.folders, { onDelete: 'CASCADE' })
  @JoinTable()
  categories: Category[];
}
