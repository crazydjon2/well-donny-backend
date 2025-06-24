import { IsString } from 'class-validator';

export class CreateWordDto {
  @IsString()
  original: string;
  @IsString()
  translated: string;
}
