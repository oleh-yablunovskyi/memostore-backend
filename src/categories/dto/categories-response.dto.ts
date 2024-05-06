import { Category } from "../entities/category.entity";

export class CategoriesResponseDto {
  data: Category[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
