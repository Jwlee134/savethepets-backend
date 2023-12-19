import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PushModule } from 'src/push/push.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { UsersModule } from 'src/users/users.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    PushModule,
    UsersModule,
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
