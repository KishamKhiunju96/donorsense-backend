import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OcrService } from './ocr.service';
import { RejectScanDto } from './dto/reject-scan.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('ocr')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ocr')
export class OcrController {
  constructor(private ocrService: OcrService) {}

  @Get('scans')
  findAll(@OrgId() orgId: string) {
    return this.ocrService.findAll(orgId);
  }

  @Get('usage')
  getUsage(@OrgId() orgId: string) {
    return this.ocrService.getUsage(orgId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(@OrgId() orgId: string, @UploadedFile() file: Express.Multer.File) {
    return this.ocrService.upload(orgId, file);
  }

  @Patch('scans/:id/accept')
  acceptScan(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() donationData: any,
  ) {
    return this.ocrService.acceptScan(orgId, id, donationData);
  }

  @Patch('scans/:id/reject')
  rejectScan(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: RejectScanDto,
  ) {
    return this.ocrService.rejectScan(orgId, id, dto);
  }

  @Delete('scans/:id')
  remove(@OrgId() orgId: string, @Param('id') id: string) {
    return this.ocrService.remove(orgId, id);
  }
}
