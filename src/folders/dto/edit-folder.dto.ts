import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFolderDto } from './create-folder.dto';

export class EditFolderDto extends CreateFolderDto {
  @IsString()
  @IsNotEmpty({ message: 'i18n::errors.validation.required' })
  id: string;
}
