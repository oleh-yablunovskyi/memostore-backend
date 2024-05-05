import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesResponseDto } from './dto/categories-response.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<CategoriesResponseDto> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
