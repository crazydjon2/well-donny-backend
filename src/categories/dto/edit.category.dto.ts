import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateWordDto } from 'src/words/dto';

export class EditCategoryDto {
  @IsString()
  id: string;
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.name.required' })
  name: string;
  @IsString()
  description: string;
  @IsNotEmpty({ message: 'i18n::errors.validation.type.required' })
  type: string;
  // TODO ADD VALIDATOR FOR WORDS!
  @ValidateNested({ each: true })
  @ArrayMinSize(3, { message: 'i18n::errors.validation.words.minSize' })
  @Type(() => UpdateWordDto)
  words: UpdateWordDto[];
}
