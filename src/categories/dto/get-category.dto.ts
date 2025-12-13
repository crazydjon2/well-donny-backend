import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { GetUserDto } from 'src/users/dto/get-user.dto';
import { UserRole } from 'src/users_categories/users-categories.entity';

export class CategoryDTO {
  id: string;
  name: string;
  description: string;
  type: GetCategoryType;
  subtype?: GetCategoryType;
  avarageRate: string | null;
  author: GetUserDto & { role: UserRole };
  users: number;
}
