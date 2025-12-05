import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { UsersCategories } from 'src/users_categories/users-categories.entity';

export class GetByType {
  type: GetCategoryType;
  items: (UsersCategories & {
    category: {
      type: GetCategoryType;
    };
  })[];
}
