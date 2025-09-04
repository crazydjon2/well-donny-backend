/* eslint-disable @typescript-eslint/naming-convention */
import { plainToClass } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export class Environment {
  /* Application settings */
  @IsNotEmpty()
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @IsPositive()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string;
}

export const validateEnvironment = (
  config: Record<string, unknown>,
): Environment => {
  const validatedConfig = plainToClass(Environment, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
