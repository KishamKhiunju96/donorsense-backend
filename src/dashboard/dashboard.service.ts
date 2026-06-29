import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(orgId: string) {
    const now = new Date();
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const ytdStart = new Date(now.getFullYear(), 0, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [allDonations, donors, campaigns] = await Promise.all([
      this.prisma.donation.findMany({
        where: { orgId },
        select: { amount: true, createdAt: true, donorId: true, status: true },
      }),
      this.prisma.donor.findMany({ where: { orgId }, select: { id: true, createdAt: true } }),
      this.prisma.campaign.findMany({ where: { orgId, status: 'ACTIVE' } }),
    ]);

    const mtd = allDonations.filter(d => new Date(d.createdAt) >= mtdStart);
    const ytd = allDonations.filter(d => new Date(d.createdAt) >= ytdStart);
    const lastMonth = allDonations.filter(d => {
      const dt = new Date(d.createdAt);
      return dt >= lastMonthStart && dt <= lastMonthEnd;
    });

    const totalRaisedAllTime = allDonations.reduce((s, d) => s + d.amount, 0);
    const totalRaisedMTD = mtd.reduce((s, d) => s + d.amount, 0);
    const totalRaisedYTD = ytd.reduce((s, d) => s + d.amount, 0);
    const totalRaisedLastMonth = lastMonth.reduce((s, d) => s + d.amount, 0);

    const averageDonation = allDonations.length > 0
      ? totalRaisedAllTime / allDonations.length
      : 0;

    // Build 12-month trend
    const givingTrend12m = this.buildMonthlyTrend(allDonations, 12);
    const monthlyData = givingTrend12m.map(m => ({
      month: m.month,
      donations: m.amount,
      donors: 0, // TODO: compute unique donors per month if needed
    }));

    return {
      totalRaisedAllTime,
      totalRaisedMTD,
      totalRaisedYTD,
      totalDonors: donors.length,
      activeCampaigns: campaigns.length,
      averageDonation,
      conversionRate: 0,    // Requires form view data — Phase 2
      retentionRate: 0,     // Requires historical cohort analysis — Phase 2
      trends: {
        totalRaised: totalRaisedMTD >= totalRaisedLastMonth ? 'up' : 'down',
        totalDonors: 'up',  // Simplified — expand with prior-month donor count
        averageDonation: 'up',
      },
      monthlyData,
      givingTrend12m,
    };
  }

  private buildMonthlyTrend(donations: any[], months: number) {
    const now = new Date();
    const result: Array<{ month: string; amount: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const amount = donations
        .filter(don => {
          const dt = new Date(don.createdAt);
          return dt >= d && dt < next;
        })
        .reduce((s, don) => s + don.amount, 0);
      result.push({ month, amount });
    }

    return result;
  }
}
