import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }   from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService }      from '@nestjs/config';
import { UsersService }       from '../../users/users.service';
import type { JwtPayload, AuthenticatedUser } from '../../../common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest:   ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:      config.get<string>('jwt.secret')!,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findOneRaw(payload.sub);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User account is inactive or does not exist');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
