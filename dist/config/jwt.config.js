"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const config_1 = require("@nestjs/config");
exports.jwtConfig = (0, config_1.registerAs)('jwt', () => ({
    secret: process.env.JWT_SECRET ?? 'change-me',
    accessExpiresIn: process.env.JWT_ACCESS_EXP ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXP ?? '7d',
}));
//# sourceMappingURL=jwt.config.js.map