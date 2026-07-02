import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.organization.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        ein: dto.ein,
        country: dto.country,
        state: dto.state,
      },
    });

    const token = this.jwtService.sign({ sub: org.id, email: org.email });
    return { token, organization: this.sanitizeOrg(org) };
  }

  async login(dto: LoginDto) {
    const org = await this.prisma.organization.findUnique({
      where: { email: dto.email },
    });
    if (!org) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, org.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: org.id, email: org.email });
    return { token, organization: this.sanitizeOrg(org) };
  }

  async getMe(orgId: string) {
    const org = await this.prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });
    return this.sanitizeOrg(org);
  }

  private sanitizeOrg(org: any) {
    const { passwordHash: _, ...rest } = org;
    return rest;
  }
}
