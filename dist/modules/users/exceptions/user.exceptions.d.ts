import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
export declare class UserNotFoundException extends NotFoundException {
    constructor(id?: string);
}
export declare class EmailAlreadyExistsException extends ConflictException {
    constructor(email: string);
}
export declare class InsufficientPermissionsException extends ForbiddenException {
    constructor(action: string);
}
