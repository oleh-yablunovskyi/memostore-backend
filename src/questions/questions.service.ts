import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['categories'] });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async create(questionData: Omit<Question, 'id'>): Promise<Question> {
    const newQuestion = this.questionRepository.create(questionData);
    return this.questionRepository.save(newQuestion);
  }

  async update(id: number, updateQuestionDto: Partial<Question>): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`No question found with ID ${id}`);
    }
    Object.assign(question, updateQuestionDto);
    return this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Question with ID ${id} does not exist`);
    }
  }
}
