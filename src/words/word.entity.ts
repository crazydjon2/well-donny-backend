import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  original: string

	@Column()
  translated: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

	@OneToMany(() => UsersCategories, (uc) => uc.word )
	usersCategories: UsersCategories[]
}