import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService }    from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt       from 'bcrypt';
import { UsersService }  from '../users/users.service';
import { LoginDto }      from './dto/login.dto';
import { RegisterDto }   from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import type { JwtPayload } from '../../common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService:   JwtService,
    private readonly config:       ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const hashed = await bcrypt.hash(dto.password, 12);
    const user   = await this.usersService.create({ ...dto, password: hashed });
    return this.generateTokens(user.id, user.email, user.role as string);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    return this.generateTokens(user.id, user.email, user.role);
  }

  async refresh(token: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get<string>('jwt.secret'),
      });
      return this.generateTokens(payload.sub, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(sub: string, email: string, role: string): AuthResponseDto {
    const payload: Partial<JwtPayload> = { sub, email, role };
    const dto = new AuthResponseDto();
    dto.accessToken  = this.jwtService.sign(payload, { expiresIn: this.config.get('jwt.accessExpiresIn') as unknown as number });
    dto.refreshToken = this.jwtService.sign(payload, { expiresIn: this.config.get('jwt.refreshExpiresIn') as unknown as number });
    return dto;
  }
}
