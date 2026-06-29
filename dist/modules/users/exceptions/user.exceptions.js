"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsufficientPermissionsException = exports.EmailAlreadyExistsException = exports.UserNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class UserNotFoundException extends common_1.NotFoundException {
    constructor(id) {
        super(id ? `User with ID '${id}' not found` : 'User not found');
    }
}
exports.UserNotFoundException = UserNotFoundException;
class EmailAlreadyExistsException extends common_1.ConflictException {
    constructor(email) {
        super(`A user with email '${email}' already exists`);
    }
}
exports.EmailAlreadyExistsException = EmailAlreadyExistsException;
class InsufficientPermissionsException extends common_1.ForbiddenException {
    constructor(action) {
        super(`You do not have permission to ${action}`);
    }
}
exports.InsufficientPermissionsException = InsufficientPermissionsException;
//# sourceMappingURL=user.exceptions.js.map