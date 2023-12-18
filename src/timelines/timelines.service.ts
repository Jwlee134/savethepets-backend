import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timeline } from 'src/schemas/timeline.schema';
import { RequestTimelineDto } from './dtos/request-timeline.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { JwtPayload } from 'src/auth/auth.service';
import { ConfirmTimelineDto } from './dtos/confirm-timeline.dto';

@Injectable()
export class TimelinesService {
  constructor(
    @InjectModel(Timeline.name) private timelineModel: Model<Timeline>,
    private notificationsService: NotificationsService,
  ) {}

  async getTimelines(id: string) {
    return await this.timelineModel
      .find({ missingPost: id, confirmed: true })
      .populate('sightingPost', ['_id', 'address', 'time'])
      .sort({ 'sightingPost.time': 1 });
  }

  async requestTimeline(
    {
      missingPost,
      sightingPost,
      sightingPostAuthor,
      missingPostThumbnail,
    }: RequestTimelineDto,
    user: JwtPayload,
  ) {
    const existingTimeline = await this.timelineModel.exists({
      confirmed: true,
      sightingPost,
    });
    if (existingTimeline) {
      throw new ConflictException(
        '다른 실종 게시물의 타임라인에 포함되어 있는 게시물입니다.',
      );
    }
    const newTimeline = await this.timelineModel.create({
      missingPost,
      sightingPost,
    });
    await this.notificationsService.createNotification({
      content: `${user.name}님이 회원님의 목격 게시물을 타임라인에 추가하고 싶어합니다.`,
      photo: missingPostThumbnail,
      post: missingPost,
      receiver: sightingPostAuthor,
      sender: user.id,
      type: 3,
    });
    return { _id: newTimeline._id };
  }

  async getRequestedTimeline(missingPost: string, userId: string) {
    const requestedTimeline = await this.timelineModel
      .findOne({ confirmed: false, missingPost })
      .populate<{ sightingPost: { author: string } }>({
        path: 'sightingPost',
        select: 'author',
        match: { author: userId },
      });
    if (requestedTimeline) return requestedTimeline._id;
    return null;
  }

  async confirmTimeline(
    id: string,
    {
      missingPost,
      missingPostAuthor,
      missingPostThumbnail,
    }: ConfirmTimelineDto,
    user: JwtPayload,
  ) {
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: id },
      { confirmed: true },
    );
    if (!updatedTimeline) {
      throw new NotFoundException('타임라인이 존재하지 않습니다.');
    }
    await this.notificationsService.createNotification({
      content: `${user.name}님이 회원님의 타임라인 추가 요청을 수락했습니다.`,
      photo: missingPostThumbnail,
      post: missingPost,
      receiver: missingPostAuthor,
      sender: user.id,
      type: 4,
    });
    return { _id: updatedTimeline._id };
  }

  async deleteTimeline(id: string) {
    const deletedTimeline = await this.timelineModel.findOneAndDelete({
      _id: id,
    });
    if (!deletedTimeline) {
      throw new NotFoundException('타임라인이 존재하지 않습니다.');
    }
    return { _id: deletedTimeline._id };
  }
}
