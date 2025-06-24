import { IsArray, IsString } from 'class-validator';

export class DeleteCardDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
