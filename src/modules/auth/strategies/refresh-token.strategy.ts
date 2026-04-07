import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    console.log('RefreshTokenStrategy.validate called');
    console.log('Payload', { sub: payload.sub, email: payload.email });

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('No Authorization header found');
      throw new UnauthorizedException('Token không được cung cấp');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();

    if (!refreshToken) {
      console.log('No refresh token found in Authorization header');
      throw new UnauthorizedException(
        'Refresh token không được cung cấp sau khi loại bỏ Bearer',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, refreshToken: true, role: true },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc không có refresh token',
      );
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
