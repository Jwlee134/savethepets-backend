import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { User } from 'src/decorators/user.decorator';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Get('my-bookmarks')
  async getMyBookmarks(@User('id') id: string) {
    return await this.bookmarksService.getMyBookmarks(id);
  }

  @Post(':id')
  async createBookmark(
    @Param('id') postId: string,
    @User('id') userId: string,
  ) {
    return await this.bookmarksService.createBookmark(postId, userId);
  }

  @Delete(':id')
  async deleteBookmark(
    @Param('id') postId: string,
    @User('id') userId: string,
  ) {
    return await this.bookmarksService.deleteBookmark(postId, userId);
  }
}
