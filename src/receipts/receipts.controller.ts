import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private receiptsService: ReceiptsService) {}

  @Get()
  findAll(@OrgId() orgId: string) {
    return this.receiptsService.findAll(orgId);
  }

  @Get('pending')
  findPending(@OrgId() orgId: string) {
    return this.receiptsService.findPending(orgId);
  }

  @Get('by-donation/:donationId')
  findByDonation(
    @OrgId() orgId: string,
    @Param('donationId') donationId: string,
  ) {
    return this.receiptsService.findByDonation(orgId, donationId);
  }

  @Post('send/:donationId')
  sendReceipt(@OrgId() orgId: string, @Param('donationId') donationId: string) {
    return this.receiptsService.sendReceipt(orgId, donationId);
  }

  @Post('send-bulk')
  sendBulk(@OrgId() orgId: string) {
    return this.receiptsService.sendBulk(orgId);
  }

  @Get(':id')
  findOne(@OrgId() orgId: string, @Param('id') id: string) {
    return this.receiptsService.findOne(orgId, id);
  }
}
