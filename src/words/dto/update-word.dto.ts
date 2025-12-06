import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWordDto {
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.original' })
  original: string;
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.word.translated' })
  translated: string;
  @IsString()
  id;
  @IsBoolean()
  @IsOptional()
  toDelete: boolean;
}
