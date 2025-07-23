import { CategoriesTypes } from 'src/categories_types/categories-types.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UsersCategories, (uc) => uc.category)
  userCategories: UsersCategories[];

  @ManyToOne(() => CategoriesTypes, (ct) => ct.id)
  categoriesTypes: CategoriesTypes;
}
