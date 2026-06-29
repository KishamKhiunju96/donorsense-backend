"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'INTERNAL_SERVER_ERROR';
        let message = 'An unexpected error occurred';
        let details;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            error = this.getErrorCode(statusCode);
            const body = exception.getResponse();
            if (typeof body === 'string') {
                message = body;
            }
            else if (typeof body === 'object' && body !== null) {
                const bodyObj = body;
                message = bodyObj['message'] ?? message;
                if (Array.isArray(bodyObj['message'])) {
                    message = 'Validation failed';
                    details = this.formatValidationErrors(bodyObj['message']);
                    error = 'VALIDATION_ERROR';
                }
            }
        }
        else {
            this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
        }
        const errorResponse = {
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
    getErrorCode(status) {
        const map = {
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
    formatValidationErrors(messages) {
        return messages.map(msg => {
            const parts = msg.split(' ');
            return { field: parts[0] ?? 'unknown', message: msg };
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map