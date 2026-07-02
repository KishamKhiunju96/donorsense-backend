import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  details?: ValidationDetail[];
  timestamp: string;
  path: string;
}

interface ValidationDetail {
  field: string;
  message: string;
}

@Catch() // catches ALL exceptions — both HttpException and unexpected errors
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: ValidationDetail[] | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      error = this.getErrorCode(statusCode);
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const bodyObj = body as Record<string, unknown>;
        message = (bodyObj['message'] as string) ?? message;

        // Handle class-validator ValidationPipe errors (array of messages)
        if (Array.isArray(bodyObj['message'])) {
          message = 'Validation failed';
          details = this.formatValidationErrors(bodyObj['message'] as string[]);
          error = 'VALIDATION_ERROR';
        }
      }
    } else {
      // Unexpected error — log full stack, return generic message to client
      this.logger.error(
        'Unhandled exception',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorResponse: ErrorResponse = {
      success: false,
      statusCode,
      error,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return map[status] ?? 'UNKNOWN_ERROR';
  }

  private formatValidationErrors(messages: string[]): ValidationDetail[] {
    // class-validator messages are in format: "fieldName must be..."
    return messages.map((msg) => {
      const parts = msg.split(' ');
      return { field: parts[0] ?? 'unknown', message: msg };
    });
  }
}
