import { GetCategoryType } from 'src/categories_types/dto/get-types';
import { GetCategories } from './get-categories.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

export class GetByTypeDTO extends PaginationDTO {
  typeId: string;
  name: string;
}

export class GetByType {
  type: GetCategoryType;
  items: GetCategories[];
}
