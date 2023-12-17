import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export type JwtPayload = {
  id: string;
  email: string;
};

@Injectable()
export class AuthService {
  private secret: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get('JWT_SECRET');
  }

  async signJwt(id: string, email: string) {
    const token = await this.jwtService.signAsync(
      { id, email },
      { secret: this.secret, expiresIn: '1y' },
    );
    return token;
  }

  async verifyJwt(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.secret,
    });
    return payload;
  }
}
