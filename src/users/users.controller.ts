import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePushSubscriptionDto } from './dtos/update-push-subscription.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('push')
  async updatePushSubscription(
    @Body() dto: UpdatePushSubscriptionDto,
    @User('id') userId: string,
  ) {
    return await this.usersService.updatePushSubscription(dto, userId);
  }
}
