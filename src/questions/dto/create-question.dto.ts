import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Content must not be empty' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'Category ID must not be empty' })
  @IsInt({ message: 'Category ID must be an integer' })
  categoryId: number;
}
