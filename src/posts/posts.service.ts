import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post } from 'src/schemas/post.schema';
import { GetPostsDto } from './dtos/get-posts.dto';
import { Timeline } from 'src/schemas/timeline.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Timeline.name) private timelineModel: Model<Timeline>,
  ) {}

  async getPosts(dto: GetPostsDto) {
    return await this.postModel.find({
      latitude: { $lte: dto.neLat, $gte: dto.swLat },
      longitude: { $lte: dto.neLng, $gte: dto.swLng },
      ...(dto?.type !== undefined && { type: dto.type }),
      ...(dto?.sex !== undefined && { sex: dto.sex }),
      ...(dto?.species !== undefined && { species: dto.species }),
      ...(dto?.breed !== undefined && { breed: dto.breed }),
    });
  }

  async createPost(dto: CreatePostDto, userId: string) {
    const newPost = await this.postModel.create({
      author: userId,
      address: 'asdf',
      ...dto,
    });
    return { _id: newPost._id };
  }

  async getPost(id: string, userId?: string) {
    const post = await this.postModel
      .findById(id)
      .populate('author', ['_id', 'name', 'email']);
    /* 유저가 로그인한 상태이고 실종 게시물이며 이 게시물의 작성자가 현재 로그인한 유저의 목격 게시물에
    타임라인 추가 요청을 보낸 상태리면 isTimelineRequested를 true로 설정한다. */
    if (userId && post.type === 0) {
      const requestedTimeline = await this.timelineModel
        .findOne({ confirmed: false, missingPost: id })
        .populate<{ sightingPost: { author: string } }>(
          'sightingPost',
          'author', // select author
        );
      if (
        requestedTimeline &&
        requestedTimeline.sightingPost.author === userId
      ) {
        return { ...post.toJSON(), isTimelineRequested: true };
      }
    }
    return { ...post.toJSON(), isTimelineRequested: false };
  }

  async getPostTimeline(id: string) {
    return await this.timelineModel
      .find({ missingPost: id, confirmed: true })
      .populate('sightingPost')
      .sort({ 'sightingPost.time': 1 });
  }

  async updatePost(dto: UpdatePostDto, postId: string, userId: string) {
    const updatedPost = await this.postModel.findOneAndUpdate(
      { _id: postId, author: userId },
      dto,
    );
    if (!updatedPost) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    return { _id: updatedPost._id };
  }

  async deletePost(postId: string, userId: string) {
    const deletedPost = await this.postModel.findOneAndDelete({
      _id: postId,
      author: userId,
    });
    if (!deletedPost) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    return { _id: deletedPost._id };
  }
}
