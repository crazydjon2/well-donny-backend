import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.name.required' })
  name: string;
  @IsArray()
  @ArrayNotEmpty({ message: 'i18n::errors.validation.array.not-empty' })
  @IsNotEmpty()
  categories: string[];
}
