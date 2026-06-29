import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Name of the organization' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Unique email address of the organization' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password, minimum 8 characters', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ description: 'Employer Identification Number (EIN)' })
  @IsOptional()
  @IsString()
  ein?: string;

  @ApiPropertyOptional({ description: 'Country location of the organization' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'State location of the organization' })
  @IsOptional()
  @IsString()
  state?: string;
}
