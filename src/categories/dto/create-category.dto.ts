import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
