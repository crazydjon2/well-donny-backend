import { CategoryDTO } from '../dto';
import { Category } from '../category.entity';

export const toGetDTO = (category: Category): CategoryDTO => {
  const dto: CategoryDTO = {
    id: category.id,
    name: category.name,
    description: category.description,
    type: category.categoriesTypes,
    users: category.userCategories.map((uc) => ({
      ...uc.user,
      role: uc.role,
    })),
  };

  return dto;
};
