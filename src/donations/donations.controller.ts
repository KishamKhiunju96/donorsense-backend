import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { DonationFiltersDto } from './dto/donation-filters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('donations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @Get()
  findAll(@OrgId() orgId: string, @Query() filters: DonationFiltersDto) {
    return this.donationsService.findAll(orgId, filters);
  }

  @Get('stats')
  getStats(@OrgId() orgId: string) {
    return this.donationsService.getStats(orgId);
  }

  @Get('trend')
  getTrend12m(@OrgId() orgId: string) {
    return this.donationsService.getTrend12m(orgId);
  }

  @Get(':id')
  findOne(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donationsService.findOne(orgId, id);
  }

  @Post()
  create(@OrgId() orgId: string, @Body() dto: CreateDonationDto) {
    return this.donationsService.create(orgId, dto);
  }

  @Patch(':id')
  update(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDonationDto,
  ) {
    return this.donationsService.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donationsService.remove(orgId, id);
  }
}
