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
      synchronize: true,  // note: set to false in production!
      logging: ["error"]
    }),
    TypeOrmModule.forFeature([Category, Question]),
  ],
  providers: [DatabaseManagementService],
})
class SeedAppModule {}

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(SeedAppModule);
  const seedService = app.get(DatabaseManagementService);

  await seedService.createOtherCategory();
  console.log('Seeding complete!');

  await app.close();
}

seedDatabase();
