import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { PushDto } from './push.dto';

export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  push: PushDto;

  @IsOptional()
  @IsString()
  name: string;
}
