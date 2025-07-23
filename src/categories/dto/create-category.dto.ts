import { IsString } from 'class-validator';
import { CreateWordDto } from 'src/words/dto';

export class CreateCategoryDto {
  @IsString()
  name: string;
  type: string;
  words: CreateWordDto[];
}
