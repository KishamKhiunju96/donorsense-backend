import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { DonationFiltersDto } from './dto/donation-filters.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, filters: DonationFiltersDto = {}) {
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
      where.createdAt = { gte: cutoffs[filters.dateRange] };
    }

    const donations = await this.prisma.donation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        donor: { select: { firstName: true, lastName: true, email: true } },
        campaign: { select: { name: true } },
      },
    });

    // Flatten donor/campaign names for frontend compatibility with mock data shape
    return donations.map((d) => ({
      ...d,
      donorName: d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : null,
      donorEmail: d.donor?.email ?? null,
      campaignName: d.campaign?.name ?? null,
      donor: undefined,
      campaign: undefined,
    }));
  }

  async getStats(orgId: string) {
    const now = new Date();
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const ytdStart = new Date(now.getFullYear(), 0, 1);

    const [allTime, mtd, ytd, count] = await Promise.all([
      this.prisma.donation.aggregate({
        where: { orgId },
        _sum: { amount: true },
      }),
      this.prisma.donation.aggregate({
        where: { orgId, createdAt: { gte: mtdStart } },
        _sum: { amount: true },
      }),
      this.prisma.donation.aggregate({
        where: { orgId, createdAt: { gte: ytdStart } },
        _sum: { amount: true },
      }),
      this.prisma.donation.count({ where: { orgId } }),
    ]);

    return {
      totalRaisedAllTime: allTime._sum.amount ?? 0,
      totalRaisedMTD: mtd._sum.amount ?? 0,
      totalRaisedYTD: ytd._sum.amount ?? 0,
      totalTransactions: count,
    };
  }

  async getTrend12m(orgId: string) {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const donations = await this.prisma.donation.findMany({
      where: { orgId, createdAt: { gte: start } },
      select: { amount: true, createdAt: true },
    });

    // Group by month
    const months: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
      months[key] = 0;
    }
    for (const d of donations) {
      const key = new Date(d.createdAt).toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      });
      if (key in months) {
        const currentAmount = months[key] ?? 0;
        months[key] = currentAmount + d.amount;
      }
    }

    return Object.entries(months).map(([month, amount]) => ({
      month,
      amount: amount ?? 0,
    }));
  }

  async findOne(orgId: string, id: string) {
    const donation = await this.prisma.donation.findFirst({
      where: { id, orgId },
      include: {
        donor: true,
        campaign: { select: { name: true } },
        receipt: true,
      },
    });
    if (!donation) throw new NotFoundException('Donation not found');
    return donation;
  }

  async create(orgId: string, dto: CreateDonationDto) {
    const transactionId = dto.transactionId ?? `TXN-${Date.now()}`;
    return this.prisma.donation.create({
      data: { ...dto, orgId, transactionId, currency: dto.currency ?? 'USD' },
    });
  }

  async update(orgId: string, id: string, dto: UpdateDonationDto) {
    await this.findOne(orgId, id);
    return this.prisma.donation.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.donation.delete({ where: { id } });
    return { deleted: true };
  }
}
