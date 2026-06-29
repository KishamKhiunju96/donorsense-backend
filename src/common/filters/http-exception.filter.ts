import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const resBody = exception.getResponse() as any;

    response.status(status).json({
      success: false,
      error: resBody.error || exception.name,
      message: resBody.message || exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
