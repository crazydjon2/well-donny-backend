import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  original: string;
  @IsString()
  @IsNotEmpty()
  translated: string;
}
