import { IsString, IsNumber, IsArray, IsOptional, IsEnum } from 'class-validator';
import { PlaceType } from '@prisma/client';

export class CreatePlaceDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsEnum(PlaceType)
  type: PlaceType;

  @IsString()
  wilaya: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsArray()
  gallery?: string[];

  @IsOptional()
  @IsString()
  openHours?: string;

  @IsOptional()
  @IsString()
  priceHint?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  safetyNotes?: string;
}