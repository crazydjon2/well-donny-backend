import { IsArray, IsString } from 'class-validator';

export class DeleteWordDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
