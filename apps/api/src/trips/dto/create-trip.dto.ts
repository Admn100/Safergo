import { IsString, IsNumber, IsDateString, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateTripDto {
  @IsString()
  driverId: string;

  @IsString()
  vehicleId: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsDateString()
  dateTime: string;

  @IsNumber()
  seats: number;

  @IsNumber()
  pricePerSeat: number;

  @IsArray()
  @IsString({ each: true })
  rules: string[];

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  @IsString()
  itineraryId?: string;
}