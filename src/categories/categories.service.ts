import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesResponseDto } from './dto/categories-response.dto';
import { MAX_LIMIT } from './categories.consts';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(page: number, limit: number): Promise<CategoriesResponseDto> {
    page = Math.max(page, 1); // page must be > 0
    limit = Math.max(Math.min(limit, MAX_LIMIT), 1); // limit must be between 1 and 100

    const [results, count] = await this.categoryRepository.findAndCount({
      relations: ['questions'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = count; // total number of items in the database
    const pageCount = Math.ceil(total / limit); // total number of pages

    return {
      data: results,
      count: results.length,  // number of items in the current page
      total,
      page,
      pageCount,
    };
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`No category found with ID ${id}`);
    }
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} does not exist`);
    }
  }
}
