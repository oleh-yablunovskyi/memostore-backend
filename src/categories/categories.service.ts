import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      skip: (page - 1) * limit,
      take: limit,
      order: { createdDate: 'DESC' },
      relations: ['parent', 'children'],
    });
  
    // Load nested parents for each category
    const categoriesWithNestedParents = await Promise.all(
      results.map(category => this.loadNestedParents(category))
    );
  
    const total = count; // total number of items in the database
    const pageCount = Math.ceil(total / limit); // total number of pages
  
    return {
      data: categoriesWithNestedParents,
      count: categoriesWithNestedParents.length,  // number of items in the current page
      total,
      page,
      pageCount,
    };
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['questions', 'parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const categoryWithNestedParents = await this.loadNestedParents(category);

    return categoryWithNestedParents;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, parentId } = createCategoryDto;

    const newCategory = this.categoryRepository.create({ name });

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({ where: { id: parentId } });
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }
      newCategory.parent = parentCategory;
    }

    return this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { name, parentId } = updateCategoryDto;

    if (parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }
  
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`No category found with ID ${id}`);
    }
  
    if (name) {
      category.name = name;
    }
  
    if (parentId === undefined) {
      return this.categoryRepository.save(category);
    }
  
    if (parentId === null) {
      category.parent = null;
      return this.categoryRepository.save(category);
    }
  
    const parentCategory = await this.categoryRepository.findOne({ where: { id: parentId } });
    if (!parentCategory) {
      throw new NotFoundException(`No parent category found with ID ${parentId}`);
    }
  
    category.parent = parentCategory;
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} does not exist`);
    }
  }

  private async loadNestedParents(category: Category): Promise<Category> {
    const cloneCategory = { ...category };

    if (cloneCategory.parent) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: cloneCategory.parent.id },
        relations: ['parent'],
      });
  
      cloneCategory.parent = await this.loadNestedParents(parentCategory);
    }
  
    return cloneCategory;
  }
}
