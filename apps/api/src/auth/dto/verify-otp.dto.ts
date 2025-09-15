import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, Length } from 'class-validator'

export class VerifyOtpDto {
  @ApiProperty({ 
    description: 'Email ou téléphone utilisé pour la demande OTP', 
    example: 'user@example.com' 
  })
  @IsString()
  identifier: string

  @ApiProperty({ 
    description: 'Code OTP à 6 chiffres', 
    example: '123456' 
  })
  @IsString()
  @Length(6, 6)
  otp: string

  @ApiProperty({ 
    description: 'Nom complet (requis pour la création de compte)', 
    example: 'Ahmed Benali',
    required: false 
  })
  @IsOptional()
  @IsString()
  name?: string
}