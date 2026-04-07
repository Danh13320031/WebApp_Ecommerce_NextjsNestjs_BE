import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT_APP } from './common/constants/app.constant';
import {
  CORS_ALLOWED_HEADERS_SECURITY,
  CORS_METHODS_SECURITY,
} from './common/constants/security.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Project description
  app.setGlobalPrefix('api/v1');

  // Set global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: CORS_METHODS_SECURITY,
    allowedHeaders: CORS_ALLOWED_HEADERS_SECURITY,
  });

  await app.listen(PORT_APP);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error);
  process.exit(1);
});
