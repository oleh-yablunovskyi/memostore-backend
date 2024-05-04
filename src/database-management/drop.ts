import { NestFactory } from '@nestjs/core';
import { DatabaseManagementService } from './database-management.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Question } from '../questions/entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'test',
      database: 'postgres',
      entities: [Category, Question],
      synchronize: true,
      logging: ["error"]
    }),
    TypeOrmModule.forFeature([Category, Question]),
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
