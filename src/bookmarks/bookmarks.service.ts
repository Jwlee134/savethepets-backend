import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from 'src/schemas/bookmark.schema';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) {}

  async getMyBookmarks(userId: string) {
    return await this.bookmarkModel.find({ author: userId });
  }

  async createBookmark(postId: string, userId: string) {
    const newBookmark = await this.bookmarkModel.create({
      author: userId,
      post: postId,
    });
    return { _id: newBookmark.id };
  }

  async deleteBookmark(postId: string, userId: string) {
    const deletedBoomark = await this.bookmarkModel.findOneAndDelete({
      author: userId,
      post: postId,
    });
    return { _id: deletedBoomark.id };
  }
}
