import { Category } from 'src/categories/category.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
  LANGUAGE = 'language',
  SIENCE = 'science',
}

@Entity('categories-types')
export class CategoriesTypes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.LANGUAGE,
  })
  type: CategoryType;

  @OneToMany(() => Category, (c) => c.id)
  category: Category;
}
