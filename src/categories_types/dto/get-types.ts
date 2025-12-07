export class GetCategoryType {
  id: string;
  children?: GetCategoryType[];
  parent?: GetCategoryType;
  name: string;
  type: string;
}
