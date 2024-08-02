import { Tag } from "../entities/tag.entity";

export class TagsResponseDto {
  data: Tag[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}
