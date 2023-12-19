import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from 'src/decorators/user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@User('id') userId: string) {
    return await this.notificationsService.getMyNotifications(userId);
  }
}
