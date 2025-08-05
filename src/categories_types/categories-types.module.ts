import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesTypesController } from './categories-types.controller';
import { CategoriesTypes } from './categories-types.entity';
import { CategoriesTypesService } from './categories-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesTypes])],
  exports: [CategoriesTypesService],
  providers: [CategoriesTypesService],
  controllers: [CategoriesTypesController],
})
export class CategoriesTypesModule {}
