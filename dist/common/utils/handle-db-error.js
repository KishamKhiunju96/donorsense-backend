"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDbError = void 0;
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('DatabaseError');
const handleDbError = (error) => {
    if (isQueryFailedError(error)) {
        if (error.code === '23505') {
            throw new common_1.ConflictException('A record with these details already exists');
        }
        if (error.code === '23503') {
            throw new common_1.ConflictException('Referenced record does not exist');
        }
    }
    logger.error('Unhandled DB error', error instanceof Error ? error.stack : String(error));
    throw new common_1.InternalServerErrorException('Database operation failed');
};
exports.handleDbError = handleDbError;
function isQueryFailedError(error) {
    return typeof error === 'object' && error !== null && 'code' in error;
}
//# sourceMappingURL=handle-db-error.js.map