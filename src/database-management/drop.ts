import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { DatabaseManagementService } from './database-management.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../questions/entities/question.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { getSSLConfig } from '../common/utils/ssl-config.util';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Category, Question, Tag,],
      synchronize: false,  // note: set to false in production!
      logging: ["error"],
      ssl: getSSLConfig(process.env.SERVER_MODE),
    }),
    TypeOrmModule.forFeature([Category, Question, Tag,]),
  ],
  providers: [DatabaseManagementService],
})
class DropAppModule {}

async function dropData() {
  const app = await NestFactory.createApplicationContext(DropAppModule);
  const seedService = app.get(DatabaseManagementService);

  await seedService.clearData();
  await seedService.resetSequences();
  console.log('Data drop and sequence reset complete!');

  await app.close();
}

dropData();
