import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SeederService } from './seeder/seeder.service';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });

  const port = parseInt(dotenv.config()?.parsed?.PORT || '8080', 10);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
