import { CategoriesTypes } from 'src/categories_types/categories-types.entity';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users_categories/users-categories.entity';

export class CategoryDTO {
  id: string;
  name: string;
  description: string;
  type: CategoriesTypes;
  users: (User & { role: UserRole })[];
}
