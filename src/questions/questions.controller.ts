import {
  Controller, Get, Post, Body, Param, Patch,
  Delete, HttpCode, HttpStatus, Query,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsResponseDto } from './dto/questions-response.dto';
import { DEFAULT_LIMIT } from './questions.consts';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQueryDto,
  ): Promise<QuestionsResponseDto> {
    const {
      page = 1,
      limit = DEFAULT_LIMIT,
      search,
      categoryId = 0,
    } = query;
    return this.questionsService.findAll(page, limit, search, categoryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.questionsService.remove(id);
  }
}
