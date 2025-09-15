import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePlaceReviewDto {
  @IsString()
  placeId: string;

  @IsString()
  userId: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}