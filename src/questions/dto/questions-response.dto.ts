import { Question } from '../entities/question.entity';

export class QuestionsResponseDto {
  data: Question[];
  count: number;
}
