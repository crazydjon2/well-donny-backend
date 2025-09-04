import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Environment } from 'src/validations/validate-environment.helper';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const DEFAULT_DB_HOST = 'localhost';
const DEFAULT_DB_PORT = 5432;
const DEFAULT_DB_USERNAME = 'user';
const DEFAULT_DB_PASSWORD = 'password';
const DEFAULT_DB_DATABASE = 'mydatabase';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService<Environment>) => {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST', DEFAULT_DB_HOST),
      port: configService.get('DB_PORT', DEFAULT_DB_PORT),
      username: configService.get('DB_USERNAME', DEFAULT_DB_USERNAME),
      password: configService.get('DB_PASSWORD', DEFAULT_DB_PASSWORD),
      database: configService.get('DB_DATABASE', DEFAULT_DB_DATABASE),
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
  inject: [ConfigService],
};
