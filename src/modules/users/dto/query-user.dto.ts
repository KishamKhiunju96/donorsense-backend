import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '../users.constants';
import { SortOrder } from '../../../common/enums/sort-order.enum';

export class QueryUserDto {
  @ApiPropertyOptional({ default: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, maximum: 100, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by user account status' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC, description: 'Sorting order by creation date' })
  @IsOptional()
  @IsEnum(SortOrder)
  order: SortOrder = SortOrder.DESC;
}
