import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  type: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  species: number;

  @IsNotEmpty()
  @IsNumber()
  breed: number;

  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @IsNotEmpty()
  @IsNumberString()
  contact: string;

  @IsNotEmpty()
  @IsNumber()
  sex: number;

  @IsNotEmpty()
  @IsString({ each: true })
  photos: string;
}
