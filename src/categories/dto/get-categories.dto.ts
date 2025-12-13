import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { User } from 'src/users/user.entity';
import { UserRole } from 'src/users_categories/users-categories.entity';

export class GetCategoriesDTO extends PaginationDTO {
  type?: string;
  userId?: string;
  role?: UserRole;
  sort?: 'ASC' | 'DESC';
  folder?: string;
  name?: string;
}

export interface GetCategories {
  id: string;
  role: UserRole | null;
  avgRate: any;
  createdAt: Date;
  updatedAt: Date;
  author: User | null;
  category: {
    id: string;
    name: string;
    description: string;
    type: GetCategoryType;
  };
}
