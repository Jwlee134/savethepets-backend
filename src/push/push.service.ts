import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
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
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    webpush.setVapidDetails(
      'mailto:sorhd134@gmail.com',
      this.configService.get('PUSH_PUBLIC_KEY'),
      this.configService.get('PUSH_PRIVATE_KEY'),
    );
  }

  async sendPushNotification(userId: string, payload: PushPayload) {
    const { auth, endpoint, p256dh } =
      await this.usersService.getUserPushSubscription(userId);
    if (!auth || !endpoint || !p256dh) return;
    await webpush.sendNotification(
      { endpoint, keys: { auth, p256dh } },
      JSON.stringify(payload),
    );
  }
}
