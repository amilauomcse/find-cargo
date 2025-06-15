import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://3.233.184.28:5173', //frontend URL
  });

  await app.listen(3000);
}
bootstrap();
