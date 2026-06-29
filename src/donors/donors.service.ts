import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Injectable()
export class DonorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string, search?: string) {
    const where: any = { orgId };
    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q } },
      ];
    }

    const donors = await this.prisma.donor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { donations: true } },
        donations: {
          select: { amount: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return donors.map(d => this.computeDonorStats(d));
  }

  async search(orgId: string, q: string) {
    return this.findAll(orgId, q);
  }

  async getStats(orgId: string) {
    const donors = await this.prisma.donor.findMany({ where: { orgId } });
    const now = new Date();
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalDonors: donors.length,
      activeMonthly: donors.filter(d => d.tags.includes('Monthly')).length,
      majorDonors: donors.filter(d => d.tags.includes('Major Donor')).length,
      newThisMonth: donors.filter(d => new Date(d.createdAt) >= mtdStart).length,
    };
  }

  async findOne(orgId: string, id: string) {
    const donor = await this.prisma.donor.findFirst({
      where: { id, orgId },
      include: {
        donations: { orderBy: { createdAt: 'desc' } },
        receipts: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!donor) throw new NotFoundException('Donor not found');
    return this.computeDonorStats(donor);
  }

  async create(orgId: string, dto: CreateDonorDto) {
    const exists = await this.prisma.donor.findFirst({
      where: { orgId, email: dto.email },
    });
    if (exists) throw new ConflictException('A donor with this email already exists');

    return this.prisma.donor.create({
      data: { ...dto, orgId, tags: dto.tags ?? [] },
    });
  }

  async update(orgId: string, id: string, dto: UpdateDonorDto) {
    await this.findOne(orgId, id); // 404 check
    return this.prisma.donor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id); // 404 check
    await this.prisma.donor.delete({ where: { id } });
    return { deleted: true };
  }

  async getDonorDonations(orgId: string, donorId: string) {
    await this.findOne(orgId, donorId); // 404 check
    return this.prisma.donation.findMany({
      where: { orgId, donorId },
      include: { campaign: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDonorReceipts(orgId: string, donorId: string) {
    await this.findOne(orgId, donorId); // 404 check
    return this.prisma.receipt.findMany({
      where: { orgId, donorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private computeDonorStats(donor: any) {
    const donations = donor.donations ?? [];
    const totalDonated = donations.reduce((s: number, d: any) => s + d.amount, 0);
    const donationCount = donations.length;
    const lastDonation = donations[0];

    return {
      ...donor,
      donations: undefined,
      _count: undefined,
      totalDonated,
      donationCount,
      lastDonationDate: lastDonation?.createdAt ?? null,
    };
  }
}
