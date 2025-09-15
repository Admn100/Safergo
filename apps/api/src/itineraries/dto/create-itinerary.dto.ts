import { IsString, IsArray, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsArray()
  stops: Array<{
    placeId: string;
    order: number;
    dwellMin: number;
  }>;

  @IsOptional()
  @IsString()
  durationHint?: string;

  @IsOptional()
  @IsEnum(['summer', 'winter', 'all'])
  seasonality?: string;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}