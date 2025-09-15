import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';

export class SearchPlacesDto {
  @IsOptional()
  @IsEnum(['beach', 'waterfall', 'mountain', 'desert', 'heritage', 'museum', 'food', 'viewpoint', 'park', 'oasis', 'medina', 'lake'])
  type?: string;

  @IsOptional()
  @IsString()
  wilaya?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  radiusKm?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}