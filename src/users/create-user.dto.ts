import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNumber()
    tg_id: number;

    @IsString()
    name: string;
}