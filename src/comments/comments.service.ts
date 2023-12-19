import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { JwtPayload } from 'src/auth/auth.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private notificationsService: NotificationsService,
  ) {}

  async getComments(id: string) {
    return await this.commentModel
      .find({ post: id })
      .populate('author', ['_id', 'name', 'email'])
      .sort({ createdAt: -1 });
  }

  async createComment(dto: CreateCommentDto, user: JwtPayload) {
    const newComment = await this.commentModel.create({
      author: user.id,
      post: dto.post,
      content: dto.content,
    });
    if (dto.postAuthor !== user.id) {
      await this.notificationsService.createNotification({
        type: 1,
        content: `${user.name}님이 회원님의 게시물에 댓글을 남겼습니다: ${dto.content}`,
        post: dto.post,
        comment: newComment.id,
        photo: user.photo,
        receiver: dto.postAuthor,
        sender: user.id,
      });
    }
    if (dto.mentionedUserId && dto.mentionedUserName) {
      await this.notificationsService.createNotification({
        type: 2,
        content: `${user.name}님이 댓글에서 회원님을 언급했습니다: ${dto.content}`,
        post: dto.mentionedUserName,
        comment: newComment.id,
        photo: user.photo,
        receiver: dto.mentionedUserId,
        sender: user.id,
      });
    }
    return { _id: newComment._id };
  }

  async updateComment(
    commentId: string,
    user: JwtPayload,
    dto: UpdateCommentDto,
  ) {
    const updatedComment = await this.commentModel.findOneAndUpdate(
      {
        _id: commentId,
        author: user.id,
      },
      { content: dto.content },
    );
    if (!updatedComment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    if (dto.mentionedUserId && dto.mentionedUserName) {
      await this.notificationsService.createNotification({
        type: 2,
        content: `${user.name}님이 댓글에서 회원님을 언급했습니다: ${dto.content}`,
        post: dto.mentionedUserName,
        comment: updatedComment.id,
        photo: user.photo,
        receiver: dto.mentionedUserId,
        sender: user.id,
      });
    }
    return { _id: updatedComment._id };
  }

  async deleteComment(commentId: string, userId: string) {
    const deletedComment = await this.commentModel.findOneAndDelete({
      _id: commentId,
      author: userId,
    });
    if (!deletedComment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    return { _id: deletedComment._id };
  }

  async getMyComments(userId: string) {
    return await this.commentModel.find({ author: userId }).populate('post');
  }
}
