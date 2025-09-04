import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederModule } from './seeder/seeder.module';
import { WordsModule } from './words/words.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersCategoriesModule } from './users_categories/users-categories.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesTypesModule } from './categories_types/categories-types.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './configs/config';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(typeOrmConfig),
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
