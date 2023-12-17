import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  post: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
