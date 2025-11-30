import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
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
  @Type(() => CreateWordDto)
  words: CreateWordDto[];
}
