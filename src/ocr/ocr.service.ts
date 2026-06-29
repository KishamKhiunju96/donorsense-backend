import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RejectScanDto } from './dto/reject-scan.dto';
import { OcrStatus } from '@prisma/client';
import { TextractService } from './textract.service';

const OCR_MONTHLY_LIMIT = 50;

@Injectable()
export class OcrService {
  constructor(
    private prisma: PrismaService,
    private textractService: TextractService,
  ) {}

  async findAll(orgId: string) {
    return this.prisma.ocrScan.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUsage(orgId: string) {
    const now = new Date();
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      .toISOString()
      .split('T')[0];

    const used = await this.prisma.ocrScan.count({
      where: { orgId, createdAt: { gte: mtdStart } },
    });

    return {
      used,
      limit: OCR_MONTHLY_LIMIT,
      resetDate,
      percentage: Math.round((used / OCR_MONTHLY_LIMIT) * 100),
    };
  }

  async upload(orgId: string, file: Express.Multer.File) {
    // Phase 1: Store scan record with PENDING status
    // Phase 2: Call AWS Textract and parse results
    const scan = await this.prisma.ocrScan.create({
      data: {
        orgId,
        filename: file.originalname,
        status: OcrStatus.PENDING,
        // imageUrl: upload to S3 in Phase 2
      },
    });

    // TODO Phase 2:
    // const imageUrl = await this.s3Service.upload(file);
    // const extracted = await this.textractService.analyzeCheckImage(file.buffer);
    // await this.prisma.ocrScan.update({ where: { id: scan.id }, data: { status: 'REVIEW_NEEDED', imageUrl, extractedData: extracted } });

    return scan;
  }

  async acceptScan(orgId: string, scanId: string, donationData: any) {
    const scan = await this.prisma.ocrScan.findFirst({ where: { id: scanId, orgId } });
    if (!scan) throw new NotFoundException('Scan not found');

    // Create donation from accepted scan
    const donation = await this.prisma.donation.create({
      data: {
        orgId,
        amount: donationData.amount,
        status: 'RECEIVED',
        type: 'ONE_TIME',
        method: donationData.method ?? 'CHECK',
        checkNumber: donationData.checkNumber,
        donorId: donationData.donorId,
        notes: donationData.notes,
        transactionId: `OCR-${Date.now()}`,
      },
    });

    await this.prisma.ocrScan.update({
      where: { id: scanId },
      data: { status: OcrStatus.ACCEPTED, donationId: donation.id },
    });

    return { scan: { ...scan, status: 'ACCEPTED' }, donation };
  }

  async rejectScan(orgId: string, scanId: string, dto: RejectScanDto) {
    const scan = await this.prisma.ocrScan.findFirst({ where: { id: scanId, orgId } });
    if (!scan) throw new NotFoundException('Scan not found');

    return this.prisma.ocrScan.update({
      where: { id: scanId },
      data: {
        status: OcrStatus.REJECTED,
        rejectedReason: dto.reason + (dto.notes ? `: ${dto.notes}` : ''),
      },
    });
  }

  async remove(orgId: string, scanId: string) {
    const scan = await this.prisma.ocrScan.findFirst({ where: { id: scanId, orgId } });
    if (!scan) throw new NotFoundException('Scan not found');
    await this.prisma.ocrScan.delete({ where: { id: scanId } });
    return { deleted: true };
  }
}
