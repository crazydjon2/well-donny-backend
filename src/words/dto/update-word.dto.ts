import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWordDto {
  @IsString()
  @IsNotEmpty()
  original: string;
  @IsString()
  @IsNotEmpty()
  translated: string;
  @IsString()
  id;
}
