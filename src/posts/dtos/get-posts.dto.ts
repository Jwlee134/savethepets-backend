import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetPostsDto {
  @IsNotEmpty()
  @IsLatitude()
  neLat: number;

  @IsNotEmpty()
  @IsLongitude()
  neLng: number;

  @IsNotEmpty()
  @IsLatitude()
  swLat: number;

  @IsNotEmpty()
  @IsLongitude()
  swLng: number;

  @IsNumber()
  @IsOptional()
  type?: number;

  @IsNumber()
  @IsOptional()
  species?: number;

  @IsNumber()
  @IsOptional()
  breed?: number;

  @IsNumber()
  @IsOptional()
  sex?: number;
}
