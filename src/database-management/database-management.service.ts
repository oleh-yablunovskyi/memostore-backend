import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class DatabaseManagementService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async seedCategories() {
    const categoriesToSeed = ['Tech Questions', 'HR Questions', 'Real Cases', 'Other',];
  
    for (const categoryName of categoriesToSeed) {
      const existingCategory = await this.categoryRepository.findOne({ where: { name: categoryName } });
  
      let category: Category | undefined;
  
      if (!existingCategory) {
        category = this.categoryRepository.create({ name: categoryName });
        await this.categoryRepository.save(category);
        console.log(`Successfully seeded the "${categoryName}" category`);
      } else {
        category = existingCategory;
      }
    }
  }

  async seedTags() {
    const tagsToSeed = [ 'Vanilla JS', 'Typescript', 'React', 'NestJS', 'Databases', 'Blockchain',];

    for (const tagName of tagsToSeed) {
      const existingTag = await this.tagRepository.findOne({ where: { name: tagName } });

      if (!existingTag) {
        const tag = this.tagRepository.create({ name: tagName });
        await this.tagRepository.save(tag);
        console.log(`Successfully seeded the "${tagName}" tag`);
      }
    }
  }

  async assignQuestionsToDefaultCategory() {
    const defaultCategory = await this.categoryRepository.findOne({ where: { name: 'Other' } });

    // Find all questions that do not belong to any category
    const questionsWithoutCategory = await this.questionRepository.find({ where: { category: null } });

    for (const question of questionsWithoutCategory) {
      question.category = defaultCategory;
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

    // Delete all tags
    await this.tagRepository.delete({});
    console.log('Deleted all tags');
  }

  async resetSequences() {
    // Reset sequence for categories
    await this.categoryRepository.query(`ALTER SEQUENCE category_id_seq RESTART WITH 1`);
    console.log('Category ID sequence reset');

    // Reset sequence for tags
    await this.tagRepository.query(`ALTER SEQUENCE tag_id_seq RESTART WITH 1`);
    console.log('Tag ID sequence reset');
  
    // Reset sequence for questions
    await this.questionRepository.query(`ALTER SEQUENCE question_id_seq RESTART WITH 1`);
    console.log('Question ID sequence reset');
  }
}
