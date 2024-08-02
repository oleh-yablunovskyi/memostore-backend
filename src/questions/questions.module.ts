import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/question.entity';
import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), CategoriesModule, TagsModule],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
