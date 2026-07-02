import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getMe(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) throw new NotFoundException('Organization not found');
    const { passwordHash: _, ...rest } = org;
    return rest;
  }

  async update(orgId: string, dto: UpdateOrganizationDto) {
    await this.getMe(orgId); // 404 check
    const updated = await this.prisma.organization.update({
      where: { id: orgId },
      data: dto,
    });
    const { passwordHash: _, ...rest } = updated;
    return rest;
  }
}
