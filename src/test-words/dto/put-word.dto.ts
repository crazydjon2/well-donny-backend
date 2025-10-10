import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PutWordDTO {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  categoryId: string;
  @IsNotEmpty()
  wordId: string;
  @IsNotEmpty()
  @IsBoolean()
  isAnswered: boolean;
}
