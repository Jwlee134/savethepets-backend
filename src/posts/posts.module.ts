import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosModule } from 'src/photos/photos.module';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { Timeline, TimelineSchema } from 'src/schemas/timeline.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Timeline.name, schema: TimelineSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    PhotosModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
