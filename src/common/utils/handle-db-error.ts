import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';

const logger = new Logger('DatabaseError');

export const handleDbError = (error: unknown): never => {
  if (isQueryFailedError(error)) {
    // PostgreSQL unique constraint violation
    if (error.code === '23505') {
      throw new ConflictException('A record with these details already exists');
    }
    // PostgreSQL foreign key violation
    if (error.code === '23503') {
      throw new ConflictException('Referenced record does not exist');
    }
  }
  logger.error('Unhandled DB error', error instanceof Error ? error.stack : String(error));
  throw new InternalServerErrorException('Database operation failed');
};

function isQueryFailedError(error: unknown): error is { code: string; detail: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}
