import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../seed/seed.service';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);
  await seedService.seedCategories();
  console.log('Seeding complete!');

  await app.close();
}

seedDatabase();
