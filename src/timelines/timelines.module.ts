import { Module } from '@nestjs/common';
import { TimelinesService } from './timelines.service';
import { TimelinesController } from './timelines.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timeline, TimelineSchema } from 'src/schemas/timeline.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timeline.name, schema: TimelineSchema },
    ]),
    NotificationsModule,
  ],
  providers: [TimelinesService],
  controllers: [TimelinesController],
  exports: [TimelinesService],
})
export class TimelinesModule {}
