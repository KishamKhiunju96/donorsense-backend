import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  appName: process.env.APP_NAME ?? 'DonorSense API',
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173'
  ).split(','),
}));
