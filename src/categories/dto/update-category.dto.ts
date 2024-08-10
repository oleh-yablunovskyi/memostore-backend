import { IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
