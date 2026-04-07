import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT_APP } from './common/constants/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Project description
  app.setGlobalPrefix('api/v1');
  await app.listen(PORT_APP);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start the application', error);
  process.exit(1);
});
