import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SeederService } from './seeder/seeder.service';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
    },
  });
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  console.log(`Listening on port ${port}`);
  await app.listen(port);

  // const seeder = app.get(SeederService);
  // await seeder.seed();
}
bootstrap();
