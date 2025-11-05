import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWordDto {
  @IsString()
  @IsNotEmpty()
  original: string;
  @IsString()
  @IsNotEmpty()
  translated: string;
  @IsString()
  id;
  @IsBoolean()
  @IsOptional()
  toDelete: boolean;
}
