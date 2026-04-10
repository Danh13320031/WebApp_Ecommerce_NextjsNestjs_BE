import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Enable swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Ecommerce App Api Documentation')
    .setDescription('Ecommerce App Api Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Refresh-JWT',
        name: 'JWT',
        description: 'Enter refresh JWT token',
        in: 'header',
      },
      'Refresh-JWT-auth',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Ecommerce App Api Documentation',
    customfavIcon: 'https://nestjs.com/favicon.ico',
  });

  await app.listen(PORT_APP);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error);
  process.exit(1);
});
