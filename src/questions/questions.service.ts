import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsResponseDto } from './dto/questions-response.dto';
import { MAX_LIMIT } from './questions.consts';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  private async findQuestions(options: {
    page: number;
    limit: number;
    order?: { [key: string]: 'ASC' | 'DESC' };
    where?: any;
  }): Promise<QuestionsResponseDto> {
    const { page, limit, where, order } = options;
    const adjustedPage = Math.max(page, 1); // page must be > 0
    const adjustedLimit = Math.max(Math.min(limit, MAX_LIMIT), 1); // limit must be between 1 and MAX_LIMIT

    const [results, count] = await this.questionRepository.findAndCount({
      skip: (adjustedPage - 1) * adjustedLimit,
      take: adjustedLimit,
      order: order || { createdDate: 'DESC' },
      where,
      relations: ['category', 'tags'],
    });

    const total = count; // total number of items in the database
    const pageCount = Math.ceil(total / adjustedLimit); // total number of pages

    return {
      data: results,
      count: results.length,  // number of items in the current page
      total,
      page: adjustedPage,
      pageCount,
    };
  }

  async findAll(page: number, limit: number): Promise<QuestionsResponseDto> {
    return this.findQuestions({ page, limit });
  }

  async findByCategory(categoryId: number, page: number, limit: number): Promise<QuestionsResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return this.findQuestions({ page, limit, where: { category: { id: categoryId } } });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
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
  
    const tags = await this.tagRepository.findByIds(createQuestionDto.tagIds);
    if (tags.length !== createQuestionDto.tagIds.length) {
      throw new NotFoundException(`One or more tags not found`);
    }
  
    const newQuestion = this.questionRepository.create({
      title: createQuestionDto.title,
      content: createQuestionDto.content,
      category: category,
      tags: tags,
    });

    return this.questionRepository.save(newQuestion);
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const { categoryId, tagIds, ...fieldsToUpdate } = updateQuestionDto;

    // Simultaneously check for the question and category if categoryId is provided.
    const [question, category, tags] = await Promise.all([
      this.questionRepository.findOne({ where: { id }, relations: ['category', 'tags'] }),
      categoryId ? this.categoryRepository.findOne({ where: { id: categoryId } }) : Promise.resolve(null),
      tagIds ? this.tagRepository.findByIds(tagIds) : Promise.resolve(null),
    ]);
  
    if (!question) {
      throw new NotFoundException(`No question found with ID ${id}`);
    }
    if (categoryId && !category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    if (tagIds && tags.length !== tagIds.length) {
      throw new NotFoundException(`One or more tags not found`);
    }
  
    if (category) {
      question.category = category;
    }
    if (tags) {
      question.tags = tags;
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
}
