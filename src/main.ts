import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SeederService } from './seeder/seeder.service';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorService } from './common/services/error.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });

  const errorService = app.get(ErrorService);
  const port = parseInt(dotenv.config()?.parsed?.PORT || '8080', 10);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const validationResult = errorService.processValidationErrors(
          validationErrors,
          'ValidationPipe',
        );
        return new BadRequestException(
          errorService.buildValidationResponse(validationResult, 400),
        );
      },
    }),
  );
  await app.listen(port);
}
bootstrap();
