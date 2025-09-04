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
// import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

console.log(dotenv.config()?.parsed);

const env = dotenv.config()?.parsed;
console.log('SOSAL', process.env.DB_HOST);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env?.DB_HOST || 'localhost',
      port: parseInt(env?.DB_PORT || '5432', 10),
      username: env?.DB_USERNAME || 'user',
      password: env?.DB_PASSWORD || 'password',
      database: env?.DB_DATABASE || 'mydatabase',
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
