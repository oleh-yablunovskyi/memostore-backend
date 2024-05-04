import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enables CORS for all origins
  
  // Use ValidationPipe to enable global validation for all incoming requests
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform incoming payloads to DTO objects
    whitelist: true, // Strip away unknown properties from incoming payloads
    forbidNonWhitelisted: true, // Throw an error if unknown properties are present in incoming payloads
  }));

  await app.listen(3001);
}
bootstrap();
