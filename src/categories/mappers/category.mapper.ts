import { CategoryDTO } from '../dto';
import { Category } from '../category.entity';
import {
  UserRole,
  UsersCategories,
} from 'src/users_categories/users-categories.entity';

export const toGetDTO = (category: Category): CategoryDTO => {
  const dto: CategoryDTO = {
    id: category.id,
    name: category.name,
    description: category.description,
    type: category.categoriesTypes,
    avarageRate: (() => {
      const ratedUserCategories = category.userCategories.filter(
        (uc) => uc.rate,
      );
      if (ratedUserCategories.length === 0) return null;

      const totalRates = ratedUserCategories.reduce(
        (acc: number, uc: UsersCategories) => {
          return (uc.rate || 0) + acc;
        },
        0,
      );

      return (totalRates / ratedUserCategories.length).toFixed(1);
    })(),
    author: category.userCategories
      .map((uc) => ({
        ...uc.user,
        role: uc.role,
        rate: uc.rate,
        completionСount: uc.completionСount,
      }))
      .filter((uc) => uc.role === UserRole.CREATOR)[0],
    users: category.userCategories.length,
  };

  return dto;
};
