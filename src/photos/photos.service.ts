import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotosService {
  constructor(private configService: ConfigService) {}
}
