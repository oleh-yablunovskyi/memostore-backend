import {
  Controller, Get, Post, Body, Patch, Param, Query, Delete,
  DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsResponseDto } from './dto/tags-response.dto';
import { DEFAULT_LIMIT } from './tags.consts';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe) limit: number,
  ): Promise<TagsResponseDto> {
    return this.tagsService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Post()
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(createTagDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto): Promise<Tag> {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.tagsService.remove(id);
  }
}
