import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  userId: string;

  @IsString()
  licenseNumber: string;

  @IsOptional()
  @IsArray()
  badges?: string[];
}