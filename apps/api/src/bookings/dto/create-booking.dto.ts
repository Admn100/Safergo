import { IsString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  tripId: string;

  @IsString()
  userId: string;

  @IsNumber()
  seats: number;

  @IsNumber()
  priceTotal: number;
}