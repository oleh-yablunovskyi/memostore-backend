
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name: string;
}
