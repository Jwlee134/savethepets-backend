import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserPushSubscription(id: string) {
    const { push } = await this.userModel.findById(id);
    return push;
  }

  async updateProfile(dto: UpdateProfileDto, userId: string) {
    await this.userModel.findByIdAndUpdate(userId, dto);
  }

  async updatePhoto() {}

  async getUserById(id: string, { isMe }: { isMe?: boolean } = {}) {
    const user = await this.userModel.findById(id);
    if (isMe) {
      const { push, ...rest } = user.toJSON();
      return rest;
    }
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    const { push, email, ...rest } = user.toJSON();
    return rest;
  }
}
