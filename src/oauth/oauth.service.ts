import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class OauthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async googleLogin(code: string) {
    let accessToken: string;
    let user: UserDocument;
    try {
      const {
        data: { access_token },
      } = await axios<{ access_token: string }>({
        url: 'https://oauth2.googleapis.com/token',
        method: 'POST',
        params: {
          client_id: this.configService.get('GOOGLE_CLIENT_ID'),
          client_secret: this.configService.get('GOOGLE_CLIENT_SECRET'),
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.configService.get('GOOGLE_REDIRECT_URI'),
        },
      });
      accessToken = access_token;
    } catch {
      throw new UnauthorizedException('Google API access token POST error');
    }
    try {
      const { data } = await axios.get<{
        email: string;
        name: string;
        picture: string;
      }>('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        user = await this.userModel.create({
          email: data.email,
          name: data.name,
          photo: data.picture,
        });
      }
      const token = await this.authService.signJwt(
        user.id,
        user.name,
        user.photo,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('Google API user info GET error');
    }
  }

  async githubLogin(code: string) {
    let accessToken: string;
    let user: UserDocument;
    try {
      const {
        data: { access_token },
      } = await axios<{ access_token: string }>({
        url: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        params: {
          client_id: this.configService.get('GITHUB_CLIENT_ID'),
          client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
          code,
          redirect_uri: this.configService.get('GITHUB_REDIRECT_URI'),
        },
        headers: { Accept: 'application/json' },
      });
      accessToken = access_token;
    } catch {
      throw new UnauthorizedException('Github API access token POST error');
    }
    try {
      const { data } = await axios.get<{
        email: string;
        name: string;
        avatar_url: string;
      }>('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        user = await this.userModel.create({
          email: data.email,
          name: data.name,
          photo: data.avatar_url,
        });
      }
      const token = await this.authService.signJwt(
        user.id,
        user.name,
        user.photo,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('Github API user info GET error');
    }
  }
}
