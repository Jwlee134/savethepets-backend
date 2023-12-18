import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  id: string;
  name: string;
  photo: string;
}

@Injectable()
export class AuthService {
  private secret: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get('JWT_SECRET');
  }

  async signJwt(id: string, name: string, photo: string) {
    const token = await this.jwtService.signAsync(
      { id, name, photo },
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
