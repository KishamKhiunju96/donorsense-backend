import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// PartialType makes all fields optional; OmitType removes password from updates
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {}
