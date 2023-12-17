import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async getComments(id: string) {
    return await this.commentModel
      .find({ post: id })
      .populate('author', ['_id', 'name', 'email'])
      .sort({ createdAt: -1 });
  }

  async createComment({ post, content }: CreateCommentDto, userId: string) {
    const newComment = await this.commentModel.create({
      author: userId,
      post,
      content,
    });
    return { _id: newComment._id };
  }

  async updateComment(commentId: string, userId: string, content: string) {
    const updatedComment = await this.commentModel.findOneAndUpdate(
      {
        _id: commentId,
        author: userId,
      },
      { content },
    );
    if (!updatedComment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
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
}
