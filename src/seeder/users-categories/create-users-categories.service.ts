import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/create-user.dto';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { UsersCategories } from 'src/users_categories/users-categories.entity';
import { Word } from 'src/words/word.entity';

@Injectable()
export class CreateUsersCategoriesSeederService {
    constructor(
        @InjectRepository(UsersCategories)
        private readonly usersCategoriesRepo: Repository<UsersCategories>,
    ) { }

    async seed(users: User[], categories: Category[], words: Word[]): Promise<User[]> {
        const existing = await this.usersCategoriesRepo.count();
        if (existing === 0) {
            users.forEach(async (user: User) => {
                const t: {
                    user: User;
                    category: Category;
                    word: Word;
                }[] = []
                categories.forEach((category: Category) => {
                    const r = words.map((word: Word) => {
                        console.log(user.id, word.id, category.id)
                        return { user, category, word }
                    })
                    t.push(...r)
                })
                await this.usersCategoriesRepo.save(t)
            })
        }
        return []
    }
}