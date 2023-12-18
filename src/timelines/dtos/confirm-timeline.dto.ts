import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmTimelineDto {
  @IsNotEmpty()
  @IsString()
  missingPost: string;

  @IsNotEmpty()
  @IsString()
  missingPostThumbnail: string;

  @IsNotEmpty()
  @IsString()
  missingPostAuthor: string;
}
