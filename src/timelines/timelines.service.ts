import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Timeline } from 'src/schemas/timeline.schema';
import { RequestTimelineDto } from './dtos/request-timeline.dto';

@Injectable()
export class TimelinesService {
  constructor(
    @InjectModel(Timeline.name) private timelineModel: Model<Timeline>,
  ) {}

  async getTimelines(id: string) {
    return await this.timelineModel
      .find({ missingPost: id, confirmed: true })
      .populate('sightingPost', ['_id', 'address', 'time'])
      .sort({ 'sightingPost.time': 1 });
  }

  async requestTimeline({ missingPost, sightingPost }: RequestTimelineDto) {
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

  async confirmTimeline(id: string) {
    const updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { _id: id },
      { confirmed: true },
    );
    if (!updatedTimeline) {
      throw new NotFoundException('타임라인이 존재하지 않습니다.');
    }
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
