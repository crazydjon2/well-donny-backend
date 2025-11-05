import { Category } from 'src/categories/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CategoryType {
  LANGUAGE = 'language',
  SCIENCE = 'science',
  OTHER = 'other',

  // Подтипы для языков
  LANGUAGE_ENGLISH = 'english',
  LANGUAGE_RUSSIAN = 'russian',
  LANGUAGE_SPANISH = 'spanish',
  LANGUAGE_GERMANY = 'germany',
  LANGUAGE_OTHER = 'language_other',

  // Подтипы для науки
  SCIENCE_MATH = 'math',
  SCIENCE_PHISIC = 'phisic',
  SCIENCE_BIOLOGY = 'biology',
  SCIENCE_OTHER = 'science_other',
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

  // Субтипы - связь на саму себя
  @ManyToOne(() => CategoriesTypes, (type) => type.children, {
    nullable: true,
  })
  parent: CategoriesTypes;

  @OneToMany(() => CategoriesTypes, (type) => type.parent)
  children: CategoriesTypes[];

  @OneToMany(() => Category, (c) => c.id)
  category: Category;
}
