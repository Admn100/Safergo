import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  fromUserId: string;

  @IsString()
  toUserId: string;

  @IsString()
  bookingId: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}