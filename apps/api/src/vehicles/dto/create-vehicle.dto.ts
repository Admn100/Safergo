import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  driverId: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @IsNumber()
  seats: number;

  @IsString()
  plate: string;

  @IsOptional()
  @IsArray()
  photos?: string[];
}