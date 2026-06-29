import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email address of the organization' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password of the organization' })
  @IsString()
  password!: string;
}
