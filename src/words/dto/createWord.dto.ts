import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.original' })
  original: string;
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.translated' })
  translated: string;
}
