import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://3.233.184.28:3030', //frontend URL
  });

  await app.listen(3003);
}
bootstrap();
