import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederModule } from './seeder/seeder.module';
import { WordsModule } from './words/words.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersCategoriesModule } from './users_categories/users-categories.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesTypesModule } from './categories_types/categories-types.module';
import { ConfigModule } from '@nestjs/config';
import { TestWordsModule } from './test-words/test-words.module';
import { UserLearningStrickModule } from './user-learning-strick/user-learning-strick.module';
import { FolderModule } from './folders/folder.module';
import { FoldersCategoriesModule } from './folders-categories/folders-categories.module';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path'; // ← Исправлено: * as path
import { ErrorService } from './common/services/error.service';
// import * as dotenv from 'dotenv';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_DATABASE || 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      resolvers: [QueryResolver, new HeaderResolver(['x-lang'])], // Определяет язык по query-параметру, e.g. ?lang=ru
    }),
    UserModule,
    SeederModule,
    WordsModule,
    CategoriesModule,
    UsersCategoriesModule,
    CardsModule,
    CategoriesTypesModule,
    TestWordsModule,
    AuthModule,
    UserLearningStrickModule,
    FolderModule,
    FoldersCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorService],
})
export class AppModule {}
