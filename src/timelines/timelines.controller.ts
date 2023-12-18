import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestTimelineDto } from './dtos/request-timeline.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtPayload } from 'src/auth/auth.service';
import { ConfirmTimelineDto } from './dtos/confirm-timeline.dto';

@Controller('timelines')
export class TimelinesController {
  constructor(private timelinesService: TimelinesService) {}

  @Public()
  @Get()
  async getTimelines(@Query('postId') id: string) {
    return await this.timelinesService.getTimelines(id);
  }

  @Post()
  async requestTimeline(
    @Body() dto: RequestTimelineDto,
    @User() user: JwtPayload,
  ) {
    return await this.timelinesService.requestTimeline(dto, user);
  }

  @Put(':id')
  async confirmTimeline(
    @Param('id') id: string,
    @Body() dto: ConfirmTimelineDto,
    @User() user: JwtPayload,
  ) {
    return await this.timelinesService.confirmTimeline(id, dto, user);
  }

  @Delete(':id')
  async deleteTimeline(@Param('id') id: string) {
    return await this.timelinesService.deleteTimeline(id);
  }
}
