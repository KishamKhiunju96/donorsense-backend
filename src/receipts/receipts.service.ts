import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ReceiptsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAll(orgId: string) {
    return this.prisma.receipt.findMany({
      where: { orgId },
      include: {
        donor: { select: { firstName: true, lastName: true, email: true } },
        donation: { select: { amount: true, campaignId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(orgId: string) {
    // Donations that have no receipt yet
    return this.prisma.donation.findMany({
      where: { orgId, receipt: null },
      include: {
        donor: { select: { firstName: true, lastName: true, email: true } },
        campaign: { select: { name: true } },
      },
    });
  }

  async findByDonation(orgId: string, donationId: string) {
    return this.prisma.receipt.findFirst({
      where: { donationId, orgId },
      include: {
        donor: true,
        donation: true,
      },
    });
  }

  async findOne(orgId: string, id: string) {
    const receipt = await this.prisma.receipt.findFirst({
      where: { id, orgId },
      include: {
        donor: true,
        donation: true,
      },
    });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  async sendReceipt(orgId: string, donationId: string) {
    const donation = await this.prisma.donation.findFirst({
      where: { id: donationId, orgId },
      include: {
        donor: true,
        campaign: { select: { name: true } },
      },
    });
    if (!donation) throw new NotFoundException('Donation not found');

    const receiptNumber = `RCP-${Date.now()}`;

    // Create receipt record
    const receipt = await this.prisma.receipt.upsert({
      where: { donationId },
      update: {
        sentAt: new Date(),
        sentTo: donation.donor?.email,
        sentVia: 'email',
      },
      create: {
        orgId,
        donorId: donation.donorId!,
        donationId,
        receiptNumber,
        sentAt: new Date(),
        sentTo: donation.donor?.email,
        sentVia: 'email',
      },
    });

    // Phase 2: Call SendGrid to actually send the email
    await this.emailService.sendReceiptEmail(donation, receipt);

    return {
      success: true,
      sentTo: donation.donor?.email,
      receiptNumber: receipt.receiptNumber,
    };
  }

  async sendBulk(orgId: string) {
    const pending = await this.findPending(orgId);
    const results = [];
    for (const donation of pending) {
      try {
        const result = await this.sendReceipt(orgId, donation.id);
        results.push({ donationId: donation.id, ...result });
      } catch (e: any) {
        results.push({ donationId: donation.id, success: false, error: e.message });
      }
    }
    return { total: pending.length, results };
  }
}
