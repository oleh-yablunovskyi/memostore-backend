import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    QuestionsModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'test',
      database: 'postgres',
      // logging: true,
      // logging: ["query", "error"],
      logging: ["error"],
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // note: set to false in production!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
