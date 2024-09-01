import { IsOptional, IsNotEmpty, IsString, IsInt, ValidateIf } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateIf((o) => o.parentId !== null)
  @IsInt({ message: 'Parent ID must be an integer or null' })
  parentId?: number | null;
}
