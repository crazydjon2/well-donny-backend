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
// import * as dotenv from 'dotenv';

console.log('BABAL', process.env);

// const env = dotenv.config()?.parsed;
console.log('SOSAL', process.env.DATABASE_HOST);
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
