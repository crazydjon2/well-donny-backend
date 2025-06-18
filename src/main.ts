import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

const dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? 3000);
  
    const seeder = app.get(SeederService);
  await seeder.seed();
}
bootstrap();
