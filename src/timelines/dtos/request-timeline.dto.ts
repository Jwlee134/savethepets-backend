import { IsNotEmpty, IsString } from 'class-validator';

export class RequestTimelineDto {
  @IsNotEmpty()
  @IsString()
  missingPost: string;

  @IsNotEmpty()
  @IsString()
  missingPostThumbnail: string;

  @IsNotEmpty()
  @IsString()
  sightingPost: string;

  @IsNotEmpty()
  @IsString()
  sightingPostAuthor: string;
}
