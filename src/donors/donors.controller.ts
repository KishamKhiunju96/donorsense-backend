import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('donors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('donors')
export class DonorsController {
  constructor(private donorsService: DonorsService) {}

  @Get()
  findAll(@OrgId() orgId: string, @Query('search') search?: string) {
    return this.donorsService.findAll(orgId, search);
  }

  @Get('search')
  search(@OrgId() orgId: string, @Query('q') q: string) {
    return this.donorsService.search(orgId, q);
  }

  @Get('stats')
  getStats(@OrgId() orgId: string) {
    return this.donorsService.getStats(orgId);
  }

  @Get(':id')
  findOne(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donorsService.findOne(orgId, id);
  }

  @Post()
  create(@OrgId() orgId: string, @Body() dto: CreateDonorDto) {
    return this.donorsService.create(orgId, dto);
  }

  @Patch(':id')
  update(@OrgId() orgId: string, @Param('id') id: string, @Body() dto: UpdateDonorDto) {
    return this.donorsService.update(orgId, id, dto);
  }

  @Delete(':id')
  remove(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donorsService.remove(orgId, id);
  }

  @Get(':id/donations')
  getDonorDonations(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donorsService.getDonorDonations(orgId, id);
  }

  @Get(':id/receipts')
  getDonorReceipts(@OrgId() orgId: string, @Param('id') id: string) {
    return this.donorsService.getDonorReceipts(orgId, id);
  }
}
