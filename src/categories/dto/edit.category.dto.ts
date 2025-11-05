import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UpdateWordDto } from 'src/words/dto';

export class EditCategoryDto {
  @IsString()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description: string;
  @IsNotEmpty()
  type: string;
  // TODO ADD VALIDATOR FOR WORDS!
  @ValidateNested({ each: true })
  @Type(() => UpdateWordDto)
  words: UpdateWordDto[];
}
