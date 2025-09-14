import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ 
    description: 'Adresse email', 
    example: 'user@example.com' 
  })
  @IsEmail()
  email: string

  @ApiProperty({ 
    description: 'Mot de passe', 
    example: 'password123' 
  })
  @IsString()
  password: string
}