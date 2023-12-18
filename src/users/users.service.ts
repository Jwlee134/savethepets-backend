import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UpdatePushSubscriptionDto } from './dtos/update-push-subscription.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserPushSubscription(id: string) {
    const { push } = await this.userModel.findById(id);
    return push;
  }

  async updatePushSubscription(
    { auth, endpoint, p256dh }: UpdatePushSubscriptionDto,
    userId: string,
  ) {
    await this.userModel.findByIdAndUpdate(userId, {
      push: { auth, endpoint, p256dh },
    });
  }
}
