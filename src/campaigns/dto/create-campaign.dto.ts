import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CampaignStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ description: 'Name of the fundraising campaign' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the campaign goal and mission' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ description: 'Target monetary goal' })
  @IsNumber()
  goal!: number;

  @ApiPropertyOptional({ description: 'Campaign start date in ISO string format' })
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Campaign end date in ISO string format' })
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: CampaignStatus, description: 'Campaign status', default: CampaignStatus.DRAFT })
  @IsOptional() @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiPropertyOptional({ description: 'Physical or virtual location of the campaign events' })
  @IsOptional() @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Campaign cover image URL' })
  @IsOptional() @IsString()
  imageUrl?: string;
}
