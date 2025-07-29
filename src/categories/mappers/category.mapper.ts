import { Injectable } from '@nestjs/common';
import { GetCategoryDTO } from '../dto';
import { Category } from '../category.entity';

@Injectable()
export class CategoryMapper {
  toGetDTO(category: Category): GetCategoryDTO {
    const dto: GetCategoryDTO = {
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
  }
}
