import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsString()
  payerId: string;

  @IsNumber()
  amount: number;

  @IsEnum(['CASH', 'CARD', 'BANK_TRANSFER', 'WALLET'])
  method: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}