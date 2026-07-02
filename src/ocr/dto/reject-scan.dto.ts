import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RejectScanDto {
  @ApiProperty({
    enum: [
      'Duplicate check',
      'Amount illegible',
      'Not a valid donation',
      'Other',
    ],
    description: 'Standard rejection reason',
  })
  @IsEnum([
    'Duplicate check',
    'Amount illegible',
    'Not a valid donation',
    'Other',
  ])
  reason!: string;

  @ApiPropertyOptional({
    description: 'Additional feedback or context for the rejection',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
