import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post } from 'src/schemas/post.schema';
import { GetPostsDto } from './dtos/get-posts.dto';
import { TimelinesService } from 'src/timelines/timelines.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private timelineService: TimelinesService,
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
    let requestedTimeline: Types.ObjectId | null = null;
    const post = await this.postModel
      .findById(id)
      .populate('author', ['_id', 'name', 'email']);
    if (userId && post.type === 0) {
      requestedTimeline = await this.timelineService.getRequestedTimeline(
        id,
        userId,
      );
    }
    return { ...post.toJSON(), requestedTimeline };
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
