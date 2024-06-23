import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: false }));
  app.enableShutdownHooks();
  // app.use(compression());
  // app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
