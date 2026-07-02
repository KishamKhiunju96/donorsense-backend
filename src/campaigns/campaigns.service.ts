import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async findAll(orgId: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { orgId },
      include: {
        donations: { select: { amount: true, donorId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((c) => this.enrichCampaign(c));
  }

  async findOne(orgId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, orgId },
      include: {
        donations: { select: { amount: true, donorId: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.enrichCampaign(campaign);
  }

  async create(orgId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        ...dto,
        orgId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateCampaignDto) {
    await this.findOne(orgId, id);
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.campaign.delete({ where: { id } });
    return { deleted: true };
  }

  private enrichCampaign(campaign: any) {
    const donations = campaign.donations ?? [];
    const raised = donations.reduce((s: number, d: any) => s + d.amount, 0);
    const donorIds = new Set(
      donations.map((d: any) => d.donorId).filter(Boolean),
    );
    return {
      ...campaign,
      donations: undefined,
      raised,
      donorCount: donorIds.size,
    };
  }
}
