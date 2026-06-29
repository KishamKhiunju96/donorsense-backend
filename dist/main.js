"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const app_config_1 = require("./config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    const config = app.get(app_config_1.appConfig.KEY);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: config.allowedOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector), new response_transform_interceptor_1.ResponseTransformInterceptor());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    if (config.nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle(config.appName)
            .setDescription(`${config.appName} REST API`)
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
            .addTag('Health', 'Health check')
            .addTag('Auth', 'Authentication and authorization')
            .addTag('Users', 'User management')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        new common_1.Logger('Swagger').log(`Docs available at: http://localhost:${config.port}/api/docs`);
    }
    await app.listen(config.port);
    new common_1.Logger('Bootstrap').log(`App running on port ${config.port} [${config.nodeEnv}]`);
}
bootstrap();
//# sourceMappingURL=main.js.map