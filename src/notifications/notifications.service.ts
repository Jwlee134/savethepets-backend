import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushService } from 'src/push/push.service';
import { Notification } from 'src/schemas/notification.schema';

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
  ) {}

  async createNotification(payload: CreateNotificationPayload) {
    await this.notificationModel.create(payload);
    await this.pushService.sendPushNotification(payload.receiver, payload);
  }
}
