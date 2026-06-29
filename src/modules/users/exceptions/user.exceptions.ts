import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(id ? `User with ID '${id}' not found` : 'User not found');
  }
}

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`A user with email '${email}' already exists`);
  }
}

export class InsufficientPermissionsException extends ForbiddenException {
  constructor(action: string) {
    super(`You do not have permission to ${action}`);
  }
}
