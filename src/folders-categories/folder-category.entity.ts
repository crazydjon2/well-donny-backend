import { Folder } from 'src/folders/folder.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('folders-categories')
export class FolderCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersCategories, (uc) => uc.id, { onDelete: 'CASCADE' })
  userCategory: UsersCategories;

  @ManyToOne(() => Folder, (f) => f.id, { onDelete: 'CASCADE' })
  folder: Folder;
}
