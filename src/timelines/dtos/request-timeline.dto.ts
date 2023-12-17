import { IsNotEmpty, IsString } from 'class-validator';

export class RequestTimelineDto {
  @IsNotEmpty()
  @IsString()
  missingPost: string;

  @IsNotEmpty()
  @IsString()
  sightingPost: string;
}
