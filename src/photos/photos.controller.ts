import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'posts', maxCount: 10 },
      { name: 'avatar', maxCount: 1 },
    ]),
  )
  async uploadPhotos(
    @UploadedFiles()
    photos: {
      posts: Express.Multer.File[];
      avatar: Express.Multer.File[];
    },
  ) {
    return await this.photosService.uploadPhotos(photos);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deletePhoto(@Body('key') key: string) {
    return await this.photosService.deletePhoto(key);
  }
}
