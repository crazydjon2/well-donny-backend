import { CategoriesTypes } from 'src/categories_types/categories-types.entity';
import { FolderCategory } from 'src/folders-categories/folder-category.entity';
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

  @OneToMany(() => UsersCategories, (uc) => uc.category, {
    onDelete: 'CASCADE',
  })
  userCategories: UsersCategories[];

  @ManyToOne(() => CategoriesTypes, (ct) => ct.id)
  categoriesTypes: CategoriesTypes;

  @OneToMany(() => FolderCategory, (fc) => fc.id)
  folderCategory: FolderCategory;
}
