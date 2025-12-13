import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number) // Это ключевое преобразование!
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number) // Это ключевое преобразование!
  size?: number;
}
