import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateWordDto } from 'src/words/dto';

export class CreateCategoryDto {
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
  @Type(() => CreateWordDto)
  words: CreateWordDto[];
}
