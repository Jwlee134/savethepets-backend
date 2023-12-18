import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  post: string;

  @IsNotEmpty()
  @IsString()
  postAuthor: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  mentionedUserId?: string;

  @IsOptional()
  @IsString()
  mentionedUserName?: string;
}
