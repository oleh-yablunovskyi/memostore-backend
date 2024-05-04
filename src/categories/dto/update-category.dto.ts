import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name?: string;
}
