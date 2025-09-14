import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator'

export class RequestOtpDto {
  @ApiProperty({ 
    description: 'Adresse email', 
    example: 'user@example.com',
    required: false 
  })
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => !o.phone)
  email?: string

  @ApiProperty({ 
    description: 'Numéro de téléphone', 
    example: '+213555123456',
    required: false 
  })
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.email)
  phone?: string
}