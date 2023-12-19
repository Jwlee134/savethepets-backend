import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushService } from 'src/push/push.service';
import { Notification } from 'src/schemas/notification.schema';
import { UsersService } from 'src/users/users.service';

interface CreateNotificationPayload {
  sender: string;
  receiver: string;
  post: string;
  comment?: string;
  photo: string;
  content: string;
  type: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private pushService: PushService,
    private usersService: UsersService,
  ) {}

  async createNotification(payload: CreateNotificationPayload) {
    await this.notificationModel.create(payload);
    const user = await this.usersService.getUserPushSubscription(
      payload.receiver,
    );
    if (!user || !user.auth || !user.endpoint || !user.p256dh) return;
    await this.pushService.sendPushNotification(
      { auth: user.auth, endpoint: user.endpoint, p256dh: user.p256dh },
      payload,
    );
  }

  async getMyNotifications(userId: string) {
    return await this.notificationModel.find({ receiver: userId });
  }
}
