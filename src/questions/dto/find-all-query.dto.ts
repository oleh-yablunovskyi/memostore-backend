import { IsOptional, IsInt, Min, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit?: number;

  @IsOptional()
  @MaxLength(100, { message: 'Search term is too long (maximum is 100 characters)' })
  @Matches(/^[\w\s\-.,!?"'()]+$/, { message: 'Search term contains invalid characters' })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId?: number;
}
