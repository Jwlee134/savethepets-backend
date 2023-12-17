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
import { CommentsService } from './comments.service';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/decorators/public.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get()
  async getComments(@Query('roomId') id: string) {
    return await this.commentsService.getComments(id);
  }

  @Post()
  async createComment(
    @Body() dto: CreateCommentDto,
    @User('id') userId: string,
  ) {
    return await this.commentsService.createComment(dto, userId);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() { content }: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(id, userId, content);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string, @User('id') userId: string) {
    return await this.commentsService.deleteComment(id, userId);
  }
}
