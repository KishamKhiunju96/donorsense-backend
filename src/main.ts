import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const config = app.get(appConfig.KEY);

  // ── Global prefix ──────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── CORS ───────────────────────────────────────────
  app.enableCors({
    origin: config.allowedOrigins,
    credentials: true,
  });

  // ── Global Pipes ───────────────────────────────────
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

  // ── Global Interceptors ────────────────────────────
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new ResponseTransformInterceptor(),
  );

  // ── Global Filters ─────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Swagger ────────────────────────────────────────
  if (config.nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.appName)
      .setDescription(`${config.appName} REST API`)
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT',
      )
      .addTag('Health', 'Health check')
      .addTag('Auth', 'Authentication and authorization')
      .addTag('Users', 'User management')
      // Add a tag for each new module here
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    new Logger('Swagger').log(
      `Docs available at: http://localhost:${config.port}/api/docs`,
    );
  }

  // ── Start ──────────────────────────────────────────
  await app.listen(config.port);
  new Logger('Bootstrap').log(
    `App running on port ${config.port} [${config.nodeEnv}]`,
  );
}

bootstrap();
