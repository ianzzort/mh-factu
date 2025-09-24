import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  console.log(process.env.PORT);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 8080) ;
}
void bootstrap();
