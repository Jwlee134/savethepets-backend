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
import { JwtPayload } from 'src/auth/auth.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get()
  async getComments(@Query('roomId') id: string) {
    return await this.commentsService.getComments(id);
  }

  @Get('my-comments')
  async getMyComments(@User('id') id: string) {
    return await this.commentsService.getMyComments(id);
  }

  @Post()
  async createComment(@Body() dto: CreateCommentDto, @User() user: JwtPayload) {
    return await this.commentsService.createComment(dto, user);
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @User() user: JwtPayload,
    @Body() dto: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(id, user, dto);
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string, @User('id') userId: string) {
    return await this.commentsService.deleteComment(id, userId);
  }
}
