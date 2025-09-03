import { IsNotEmpty, IsString } from 'class-validator';
import { CreateWordDto } from 'src/words/dto';

export class CreateCategoryDto {
  @IsString()
  name: string;
  @IsNotEmpty()
  type: string;
  // TODO ADD VALIDATOR FOR WORDS!
  words: CreateWordDto[];
}
