import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Question]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
