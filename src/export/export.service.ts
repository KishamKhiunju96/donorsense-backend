import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportDonors(orgId: string, res: Response) {
    const donors = await this.prisma.donor.findMany({ where: { orgId } });

    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'City',
      'State',
      'Tags',
      'Created Date',
    ];
    const rows = donors.map((d) => [
      d.firstName,
      d.lastName,
      d.email,
      d.phone ?? '',
      d.city ?? '',
      d.state ?? '',
      d.tags.join('; '),
      d.createdAt.toISOString().split('T')[0],
    ]);

    this.sendCsv(res, 'donors', headers, rows);
  }

  async exportDonations(orgId: string, res: Response, filters: any = {}) {
    const where: any = { orgId };

    if (filters.status) where.status = filters.status;
    if (filters.campaignId) where.campaignId = filters.campaignId;

    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { donor: { firstName: { contains: q, mode: 'insensitive' } } },
        { donor: { lastName: { contains: q, mode: 'insensitive' } } },
        { campaign: { name: { contains: q, mode: 'insensitive' } } },
        { transactionId: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffs = {
        '7d': new Date(now.getTime() - 7 * 86400000),
        '30d': new Date(now.getTime() - 30 * 86400000),
        '90d': new Date(now.getTime() - 90 * 86400000),
        mtd: new Date(now.getFullYear(), now.getMonth(), 1),
        ytd: new Date(now.getFullYear(), 0, 1),
      };
      where.createdAt = {
        gte: cutoffs[filters.dateRange as keyof typeof cutoffs],
      };
    }

    const donations = await this.prisma.donation.findMany({
      where,
      include: {
        donor: { select: { firstName: true, lastName: true, email: true } },
        campaign: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Date',
      'Donor',
      'Email',
      'Campaign',
      'Amount',
      'Status',
      'Type',
      'Method',
      'Transaction ID',
      'Receipt #',
    ];
    const rows = donations.map((d) => [
      d.createdAt.toISOString().split('T')[0],
      d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : 'Anonymous',
      d.donor?.email ?? '',
      d.campaign?.name ?? '',
      d.amount.toFixed(2),
      d.status,
      d.type,
      d.method,
      d.transactionId ?? '',
      d.receiptNumber ?? '',
    ]);

    this.sendCsv(res, 'donations', headers, rows);
  }

  async exportDashboard(orgId: string, res: Response) {
    const now = new Date();
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const ytdStart = new Date(now.getFullYear(), 0, 1);

    const [allDonations, donors, campaigns] = await Promise.all([
      this.prisma.donation.findMany({
        where: { orgId },
        select: { amount: true, createdAt: true },
      }),
      this.prisma.donor.count({ where: { orgId } }),
      this.prisma.campaign.count({ where: { orgId, status: 'ACTIVE' } }),
    ]);

    const mtd = allDonations.filter((d) => new Date(d.createdAt) >= mtdStart);
    const ytd = allDonations.filter((d) => new Date(d.createdAt) >= ytdStart);

    const totalRaisedAllTime = allDonations.reduce((s, d) => s + d.amount, 0);
    const totalRaisedMTD = mtd.reduce((s, d) => s + d.amount, 0);
    const totalRaisedYTD = ytd.reduce((s, d) => s + d.amount, 0);

    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Raised (All Time)', totalRaisedAllTime.toFixed(2)],
      ['Total Raised (MTD)', totalRaisedMTD.toFixed(2)],
      ['Total Raised (YTD)', totalRaisedYTD.toFixed(2)],
      ['Total Donors', donors.toString()],
      ['Active Campaigns', campaigns.toString()],
    ];

    this.sendCsv(res, 'dashboard-summary', headers, rows);
  }

  private sendCsv(
    res: Response,
    name: string,
    headers: string[],
    rows: any[][],
  ) {
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const date = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${name}-${date}.csv"`,
    );
    res.send(csv);
  }
}
