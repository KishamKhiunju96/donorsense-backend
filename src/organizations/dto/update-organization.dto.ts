import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ description: 'Display name of the organization' })
  @IsOptional() @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Employer Identification Number (EIN)' })
  @IsOptional() @IsString()
  ein?: string;

  @ApiPropertyOptional({ description: 'URL to the organization logo image' })
  @IsOptional() @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Theme configuration e.g. { primary, secondary, tertiary }' })
  @IsOptional() @IsObject()
  theme?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Country code' })
  @IsOptional() @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'State or province code' })
  @IsOptional() @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Public description of the organization and its mission' })
  @IsOptional() @IsString()
  description?: string;
}
