import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'change-me',
  accessExpiresIn: process.env.JWT_ACCESS_EXP ?? '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXP ?? '7d',
}));
