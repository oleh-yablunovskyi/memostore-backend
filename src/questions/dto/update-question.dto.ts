import { IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Content must not be empty' })
  content?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Category ID must not be empty' })
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId?: number;
}
