import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { setupApp } from './core/bootstrap';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Подключаем fastify-cookie для поддержки httpOnly cookie
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'restometrics-secret',
    parseOptions: {},
  });

  // Setup application configuration
  setupApp(app);

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Приложение запущено на http://localhost:${port}`);
  console.log(`📚 Swagger документация доступна на http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Ошибка при запуске приложения:', error);
  process.exit(1);
});
