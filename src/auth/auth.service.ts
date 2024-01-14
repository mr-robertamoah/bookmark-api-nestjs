import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: accessToken };
  }

  async signup(dto: AuthDto) {
    try {
      const email = dto.email;
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
        throw new ForbiddenException('Email taken.');
      }

      throw err;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Wrong Email');

    const matches = await argon.verify(user.hash, dto.password);

    if (!matches) throw new ForbiddenException('Wrong Password');

    return this.signToken(user.id, user.email);
  }
}
