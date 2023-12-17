import { Controller, Post, Query } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Public } from 'src/decorators/public.decorator';

@Public()
@Controller('oauth')
export class OauthController {
  constructor(private oauthService: OauthService) {}

  @Post('google')
  async googleLogin(@Query('code') code: string) {
    return await this.oauthService.googleLogin(code);
  }

  @Post('github')
  async githubLogin(@Query('code') code: string) {
    return await this.oauthService.githubLogin(code);
  }
}
