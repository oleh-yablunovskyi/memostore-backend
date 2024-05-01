import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class SeedService {
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
    const questionsWithoutCategory = await this.questionRepository.createQueryBuilder('question')
    .leftJoin('question.categories', 'category')
    .where('category.id IS NULL')
    .getMany();

    // Assign these questions to the 'Other' category
    for (const question of questionsWithoutCategory) {
      question.categories = [otherCategory];
      await this.questionRepository.save(question);
    }

    console.log(`Assigned ${questionsWithoutCategory.length} questions to the "Other" category`);
  }
}
