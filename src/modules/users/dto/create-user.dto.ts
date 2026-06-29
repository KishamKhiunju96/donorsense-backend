import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { UserRole } from '../users.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user', minLength: 1, maxLength: 100 })
  @Transform(({ value }) => (value as string)?.trim())
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address — must be unique' })
  @Transform(({ value }) => (value as string)?.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'User account password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.MEMBER, description: 'Role assigned to the user' })
  @IsEnum(UserRole)
  role!: UserRole;
}
