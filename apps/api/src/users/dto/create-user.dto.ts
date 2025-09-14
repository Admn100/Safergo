import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, IsEnum, IsArray } from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Adresse email', 
    example: 'user@example.com',
    required: false 
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ 
    description: 'Numéro de téléphone', 
    example: '+213555123456',
    required: false 
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ 
    description: 'Nom complet', 
    example: 'Ahmed Benali' 
  })
  @IsString()
  name: string

  @ApiProperty({ 
    description: 'URL de la photo de profil', 
    example: 'https://example.com/photo.jpg',
    required: false 
  })
  @IsOptional()
  @IsString()
  photo?: string

  @ApiProperty({ 
    description: 'Locale de l\'utilisateur', 
    example: 'fr',
    enum: ['fr', 'ar'],
    default: 'fr' 
  })
  @IsOptional()
  @IsString()
  locale?: string

  @ApiProperty({ 
    description: 'Rôles de l\'utilisateur', 
    example: ['USER'],
    enum: Role,
    isArray: true,
    default: ['USER'] 
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  roles?: Role[]
}