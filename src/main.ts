import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });
  await app.listen(process.env.PORT ?? 8080);

  const seeder = app.get(SeederService);
  await seeder.seed();
}
bootstrap();
