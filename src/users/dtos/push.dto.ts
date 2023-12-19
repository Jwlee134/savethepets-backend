import { IsOptional, IsString } from 'class-validator';

export class PushDto {
  @IsOptional()
  @IsString()
  endpoint: string;

  @IsOptional()
  @IsString()
  p256dh: string;

  @IsOptional()
  @IsString()
  auth: string;
}
