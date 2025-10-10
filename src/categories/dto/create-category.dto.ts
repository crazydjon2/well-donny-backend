import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateWordDto } from 'src/words/dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  type: string;
  // TODO ADD VALIDATOR FOR WORDS!
  @ValidateNested({ each: true })
  @Type(() => CreateWordDto)
  words: CreateWordDto[];
}
