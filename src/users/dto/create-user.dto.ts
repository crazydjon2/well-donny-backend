import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  tg_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
