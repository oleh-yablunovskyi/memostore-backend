import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsResponseDto } from './dto/tags-response.dto';
import { MAX_LIMIT } from './tags.consts';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(page: number, limit: number): Promise<TagsResponseDto> {
    page = Math.max(page, 1); // page must be > 0
    limit = Math.max(Math.min(limit, MAX_LIMIT), 1); // limit must be between 1 and 100

    const [results, count] = await this.tagRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdDate: 'DESC' },
      relations: ['questions'],
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

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`No tag found with ID ${id}`);
    }
    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} does not exist`);
    }
  }
}
