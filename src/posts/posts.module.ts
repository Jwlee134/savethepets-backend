import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosModule } from 'src/photos/photos.module';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { TimelinesModule } from 'src/timelines/timelines.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    PhotosModule,
    TimelinesModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
