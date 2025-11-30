import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWordDto {
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.original' })
  original: string;
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.translated' })
  translated: string;
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.translated' })
  id;
  @IsBoolean()
  @IsOptional()
  toDelete: boolean;
}
