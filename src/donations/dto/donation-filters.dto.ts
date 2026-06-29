import { IsOptional, IsEnum, IsString, IsIn } from 'class-validator';
import { DonationStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DonationFiltersDto {
  @ApiPropertyOptional({ enum: DonationStatus, description: 'Filter by donation status' })
  @IsOptional() @IsEnum(DonationStatus)
  status?: DonationStatus;

  @ApiPropertyOptional({ description: 'Filter by campaign ID' })
  @IsOptional() @IsString()
  campaignId?: string;

  @ApiPropertyOptional({ description: 'Filter by date range cutoff', enum: ['7d', '30d', '90d', 'mtd', 'ytd', 'all'] })
  @IsOptional() @IsIn(['7d', '30d', '90d', 'mtd', 'ytd', 'all'])
  dateRange?: '7d' | '30d' | '90d' | 'mtd' | 'ytd' | 'all';

  @ApiPropertyOptional({ description: 'Search query for donor name, campaign name, or transaction ID' })
  @IsOptional() @IsString()
  search?: string;
}
