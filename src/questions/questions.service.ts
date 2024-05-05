import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsResponseDto } from './dto/questions-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<QuestionsResponseDto> {
    const [results, count] = await this.questionRepository.findAndCount({ relations: ['category'] });

    return { data: results, count };
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const category = await this.categoryRepository.findOne({ where: { id: createQuestionDto.categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${createQuestionDto.categoryId} not found`);
    }

    const newQuestion = this.questionRepository.create({
      title: createQuestionDto.title,
      content: createQuestionDto.content,
      category: category,
    });

    return this.questionRepository.save(newQuestion);
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const { categoryId, ...fieldsToUpdate } = updateQuestionDto;

    // Simultaneously check for the question and category if categoryId is provided.
    const [question, category] = await Promise.all([
      this.questionRepository.findOne({ where: { id }, relations: ['category'] }),
      categoryId ? this.categoryRepository.findOne({ where: { id: categoryId } }) : Promise.resolve(null)
    ]);

    if (!question) {
      throw new NotFoundException(`No question found with ID ${id}`);
    }
    if (categoryId && !category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
  
    if (category) {
      question.category = category;
    }

    Object.assign(question, fieldsToUpdate);

    return this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Question with ID ${id} does not exist`);
    }
  }

  async findByCategory(categoryId: number): Promise<QuestionsResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const [results, count] = await this.questionRepository.findAndCount({
        where: { category: { id: categoryId } },
        relations: ['category'],
    });

    return { data: results, count };
  }
}
