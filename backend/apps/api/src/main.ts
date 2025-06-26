import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Starting NestJS application...');

  const app = await NestFactory.create(AppModule);
  console.log('✅ App module created successfully');

  app.enableCors({
    origin: true, // Allow all origins for development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  console.log('✅ CORS enabled');

  await app.listen(3000);
  console.log('✅ Application is running on: http://localhost:3000');
  console.log('📋 Available endpoints:');
  console.log('   - GET  /auth/test');
  console.log('   - POST /auth/login');
  console.log('   - POST /auth/register/organization');
}
bootstrap();
