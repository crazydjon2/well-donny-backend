import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsModule } from 'src/cards/cards.module';
import { UsersCategoriesModule } from 'src/users_categories/users-categories.module';
// import { UserModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { WordsModule } from 'src/words/words.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CardsModule,
    UsersCategoriesModule,
    AuthModule,
    WordsModule,
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
