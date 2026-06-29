import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { DonationFiltersDto } from '../donations/dto/donation-filters.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('donors')
  exportDonors(@OrgId() orgId: string, @Res() res: Response) {
    return this.exportService.exportDonors(orgId, res);
  }

  @Get('donations')
  exportDonations(
    @OrgId() orgId: string,
    @Query() filters: DonationFiltersDto,
    @Res() res: Response,
  ) {
    return this.exportService.exportDonations(orgId, res, filters);
  }

  @Get('dashboard')
  exportDashboard(@OrgId() orgId: string, @Res() res: Response) {
    return this.exportService.exportDashboard(orgId, res);
  }
}
