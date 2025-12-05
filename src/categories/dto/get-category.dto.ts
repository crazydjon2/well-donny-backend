import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users_categories/users-categories.entity';

export class CategoryDTO {
  id: string;
  name: string;
  description: string;
  type: GetCategoryType;
  subtype?: GetCategoryType;
  avarageRate: string | null;
  author: User & { role: UserRole };
  users: number;
}
