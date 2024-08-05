import { IsNotEmpty, IsString, IsInt, IsArray } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNotEmpty({ message: 'Category ID must not be empty' })
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId: number;

  @IsArray()
  @IsInt({ each: true, message: 'Each tag ID must be an integer' })
  tagIds: number[];
}
