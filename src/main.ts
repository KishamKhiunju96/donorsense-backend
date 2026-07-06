import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ── Global prefix ──────────────────────────────────
  app.setGlobalPrefix('api');

  // ── CORS — allow Next.js / Vite frontend ───────────
  app.enableCors({
    origin: (
      process.env.ALLOWED_ORIGINS ??
      'http://localhost:5173,http://localhost:3000'
    ).split(','),
    credentials: true,
  });

  // ── Global Pipes ───────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Exception Filter ────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global Response Transform ──────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Swagger ────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DonorSense API')
    .setDescription('DonorSense.AI Backend REST API — Phase 1')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'bearer',
    )
    .addTag('auth', 'Authentication: register, login, profile')
    .addTag('organizations', 'Organization profile management')
    .addTag('donors', 'Donor records & statistics')
    .addTag('donations', 'Donation records, filters & analytics')
    .addTag('campaigns', 'Fundraising campaign management')
    .addTag('receipts', 'Receipt generation & delivery')
    .addTag('ocr', 'Check scanning via AWS Textract')
    .addTag('dashboard', 'High-level analytics dashboard')
    .addTag('export', 'CSV export endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // ── Start ──────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? '5000', 10);
  await app.listen(port);

  new Logger('Bootstrap').log(
    `DonorSense API running on http://localhost:${port}`,
  );
  new Logger('Bootstrap').log(
    `Swagger docs at http://localhost:${port}/api/docs`,
  );
}

void bootstrap();
