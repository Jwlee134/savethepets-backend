import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* 
  https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
  https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3/actions
*/

@Injectable()
export class PhotosService {
  private client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('AWS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
      region: this.configService.get('AWS_REGION'),
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  private async uploadPhoto(folder: string, file: Express.Multer.File) {
    const key = `${folder}/${file.size}-${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: `${this.bucket}`,
      Key: key,
      ACL: 'public-read',
      Body: file.buffer,
    });
    await this.client.send(command);
    return `https://${this.bucket}.s3.${this.configService.get(
      'AWS_REGION',
    )}.amazonaws.com/${key}`;
  }

  async uploadPhotos({
    posts,
    avatar,
  }: {
    posts: Express.Multer.File[];
    avatar: Express.Multer.File[];
  }) {
    if (posts) {
      return await Promise.all(
        posts.map(async (file) => this.uploadPhoto('posts', file)),
      );
    }
    return { uri: await this.uploadPhoto('avatars', avatar[0]) };
  }

  async deletePhoto(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.client.send(command);
  }
}
