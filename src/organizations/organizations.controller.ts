import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId } from '../common/decorators/org-id.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('me')
  getMe(@OrgId() orgId: string) {
    return this.organizationsService.getMe(orgId);
  }

  @Patch('me')
  update(@OrgId() orgId: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(orgId, dto);
  }
}
