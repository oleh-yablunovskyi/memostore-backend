import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';

function getSSLConfig(env: string) {
  const configs = {
    production: { require: true, rejectUnauthorized: true },
    deploy: { require: true, rejectUnauthorized: false },
    local: false,
  };
  if (!configs[env] === undefined) {
    throw new Error('Set network in your .env file');
  }
  return configs[env];
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        logging: ["error"],
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        ssl: getSSLConfig(process.env.SERVER_MODE),
        synchronize: true, // note: set to false in production!
      }),
      inject: [ConfigService],
    }),
    QuestionsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
