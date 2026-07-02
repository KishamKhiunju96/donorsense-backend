import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import {
  DonationStatus,
  DonationType,
  PaymentMethod,
  Frequency,
} from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDonationDto {
  @ApiPropertyOptional({ description: 'ID of the associated donor' })
  @IsOptional()
  @IsString()
  donorId?: string;

  @ApiPropertyOptional({ description: 'ID of the associated campaign' })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiProperty({ description: 'Amount donated', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ enum: DonationStatus, description: 'Donation status' })
  @IsEnum(DonationStatus)
  status!: DonationStatus;

  @ApiProperty({ enum: DonationType, description: 'Donation type' })
  @IsEnum(DonationType)
  type!: DonationType;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method utilized' })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiPropertyOptional({
    enum: Frequency,
    description: 'Frequency of recurring donation',
  })
  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @ApiPropertyOptional({ description: 'Check number if method is CHECK' })
  @IsOptional()
  @IsString()
  checkNumber?: string;

  @ApiPropertyOptional({ description: 'Unique transaction ID' })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Internal admin notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
