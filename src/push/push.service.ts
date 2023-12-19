import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';

interface PushPayload {
  type: number;
  content: string;
  postId?: string;
  commentId?: string;
  photo: string;
}

@Injectable()
export class PushService {
  constructor(private configService: ConfigService) {
    webpush.setVapidDetails(
      'mailto:sorhd134@gmail.com',
      this.configService.get('PUSH_PUBLIC_KEY'),
      this.configService.get('PUSH_PRIVATE_KEY'),
    );
  }

  async sendPushNotification(
    {
      endpoint,
      p256dh,
      auth,
    }: { endpoint: string; p256dh: string; auth: string },
    payload: PushPayload,
  ) {
    await webpush.sendNotification(
      { endpoint, keys: { auth, p256dh } },
      JSON.stringify(payload),
    );
  }
}
