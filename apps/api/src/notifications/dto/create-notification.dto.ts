import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsEnum(['TRIP', 'BOOKING', 'MESSAGE', 'REVIEW', 'PAYMENT', 'DISPUTE', 'SYSTEM'])
  type?: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}