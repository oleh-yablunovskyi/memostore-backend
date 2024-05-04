import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class DatabaseManagementService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async createOtherCategory() {
    // Check if the 'Other' category already exists
    const existingOtherCategory = await this.categoryRepository.findOne({ where: { name: 'Other' } });

    let otherCategory: Category | undefined;

    if (!existingOtherCategory) {
      // Create and insert the 'Other' category
      otherCategory = this.categoryRepository.create({ name: 'Other' });
      await this.categoryRepository.save(otherCategory);
      console.log('Successfully seeded the "Other" category');
    } else {
      otherCategory = existingOtherCategory;
    }

    await this.assignQuestionsToOtherCategory(otherCategory);
  }

  async assignQuestionsToOtherCategory(otherCategory: Category) {
    // Find all questions that do not belong to any category
    const questionsWithoutCategory = await this.questionRepository.find({ where: { category: null } });

    // Assign these questions to the 'Other' category
    for (const question of questionsWithoutCategory) {
      question.category = otherCategory;
      await this.questionRepository.save(question);
    }

    console.log(`Assigned ${questionsWithoutCategory.length} questions to the "Other" category`);
  }

  async clearData() {
    // Delete all questions first to avoid foreign key constraint issues
    await this.questionRepository.delete({});
    console.log('Deleted all questions');

    // Delete all categories
    await this.categoryRepository.delete({});
    console.log('Deleted all categories');
  }

  async resetSequences() {
    // Reset sequence for categories
    await this.categoryRepository.query(`ALTER SEQUENCE category_id_seq RESTART WITH 1`);
    console.log('Category ID sequence reset');
  
    // Reset sequence for questions
    await this.questionRepository.query(`ALTER SEQUENCE question_id_seq RESTART WITH 1`);
    console.log('Question ID sequence reset');
  }

}
