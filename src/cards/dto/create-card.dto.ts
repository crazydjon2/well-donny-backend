import { IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  category_id: string;
  @IsString()
  word_original: string;
  @IsString()
  word_translated: string;
}
