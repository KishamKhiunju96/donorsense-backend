import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SKIP_RESPONSE_TRANSFORM_KEY } from '../decorators/skip-transform.decorator';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  any
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Allow specific endpoints to opt out (e.g. file downloads, health checks)
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skip) return next.handle();

    const request = context.switchToHttp().getRequest<Request>();

    // Retrieve custom message if defined on the route
    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => {
        const message = customMessage || getSuccessMessage(request.method);

        // If the service already returned a PaginatedResponse shape, extract and add meta
        if (isPaginatedResponse(data)) {
          const { data: items, total, page, limit, totalPages } = data;
          return {
            success: true,
            message,
            data: items,
            meta: { total, page, limit, totalPages },
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          message,
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

function isPaginatedResponse(data: unknown): data is {
  data: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} {
  return (
    data !== null &&
    typeof data === 'object' &&
    'data' in data &&
    'total' in data &&
    'page' in data
  );
}

function getSuccessMessage(method: string): string {
  const map: Record<string, string> = {
    GET: 'Data retrieved successfully',
    POST: 'Resource created successfully',
    PATCH: 'Resource updated successfully',
    PUT: 'Resource updated successfully',
    DELETE: 'Resource deleted successfully',
  };
  return map[method] ?? 'Operation successful';
}
