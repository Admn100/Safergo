import { IsOptional, IsString, IsEnum } from 'class-validator';

export class SearchItinerariesDto {
  @IsOptional()
  @IsEnum(['summer', 'winter', 'all'])
  seasonality?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}