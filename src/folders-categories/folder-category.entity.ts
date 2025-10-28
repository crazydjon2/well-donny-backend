import { Category } from 'src/categories/category.entity';
import { Folder } from 'src/folders/folder.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('folders-categories')
export class FolderCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (c) => c.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Folder, (f) => f.id, { onDelete: 'CASCADE' })
  folder: Folder;
}
