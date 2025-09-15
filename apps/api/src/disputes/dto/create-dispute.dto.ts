import { IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  bookingId: string;

  @IsString()
  reporterId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}