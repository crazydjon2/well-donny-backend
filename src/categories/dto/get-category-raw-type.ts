import { CategoriesTypes } from 'src/categories_types/categories-types.entity';

export interface RawUserCategoryResult {
  id: string;
  role: string;
  completionсount: number;
  createdat: Date;
  updatedat: Date;
  rate: number;
  userid: string;
  usertgid: string;
  username: string;
  usercreatedat: Date;
  userupdatedat: Date;
  categoryid: string;
  categoryname: string;
  categorydescription: string;
  categorycreatedat: Date;
  categoryupdatedat: Date;
  typeid: string;
  typename: string;
  averagerate: string;
  row_num: number;
  children: CategoriesTypes[];
}
