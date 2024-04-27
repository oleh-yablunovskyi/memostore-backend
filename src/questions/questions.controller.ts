import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async findAll(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Post()
  async create(@Body() questionData: Omit<Question, 'id'>): Promise<Question> {
    return this.questionsService.create(questionData);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuestionDto: Partial<Question>): Promise<Question> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.questionsService.remove(id);
  }
}
