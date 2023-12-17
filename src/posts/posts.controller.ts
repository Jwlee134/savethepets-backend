import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Public } from 'src/decorators/public.decorator';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/decorators/user.decorator';
import { GetPostsDto } from './dtos/get-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Public()
  @Get()
  async getPosts(@Query() getPostsDto: GetPostsDto) {
    return await this.postsService.getPosts(getPostsDto);
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @User('id') id: string,
  ) {
    return await this.postsService.createPost(createPostDto, id);
  }

  @Public()
  @Get(':id')
  async getPost(@Param('id') id: string, @User('id') userId?: string) {
    return await this.postsService.getPost(id, userId);
  }

  @Public()
  @Get(':id/timeline')
  async getPostTimeline(@Param('id') id: string) {
    return await this.postsService.getPostTimeline(id);
  }

  @Public()
  @Get(':id/comments')
  async getPostComments(@Param('id') id: string) {
    return await this.postsService.getPostComments(id);
  }

  @Put(':id')
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') postId: string,
    @User('id') userId: string,
  ) {
    return await this.postsService.updatePost(updatePostDto, postId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string, @User('id') userId: string) {
    return await this.postsService.deletePost(id, userId);
  }
}