import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

function getSSLConfig(env: string) {
  const configs = {
    production: { require: true, rejectUnauthorized: true },
    deploy: { require: true, rejectUnauthorized: false },
    local: false,
  };
  if (configs[env] === undefined) {
    throw new Error('Set network in your .env file');
  }
  return configs[env];
}

config(); // Load .env file

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  ssl: getSSLConfig(process.env.SERVER_MODE),
  synchronize: false,
  migrationsRun: true,
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
