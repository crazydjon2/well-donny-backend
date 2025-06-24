import { IsString } from 'class-validator';

export class EditWordDto {
  @IsString()
  original: string;
  @IsString()
  translated: string;
  @IsString()
  id;
}
