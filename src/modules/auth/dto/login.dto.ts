import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Registered email address' })
  @Transform(({ value }) => (value as string)?.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!', description: 'Account password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
