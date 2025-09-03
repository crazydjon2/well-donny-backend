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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Сделать переменные окружения доступными глобально
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost', // Используем переменную окружения
      port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5432, // Парсим в число
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UserModule,
    SeederModule,
    WordsModule,
    CategoriesModule,
    UsersCategoriesModule,
    CardsModule,
    CategoriesTypesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
