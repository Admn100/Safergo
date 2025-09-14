import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEnum, IsOptional, IsArray, IsNumber, IsObject } from 'class-validator'
import { PlaceType } from '@prisma/client'

export class CreatePlaceDto {
  @ApiProperty({ 
    description: 'Nom du lieu', 
    example: 'Plage de Sidi Fredj' 
  })
  @IsString()
  name: string

  @ApiProperty({ 
    description: 'Slug unique', 
    example: 'plage-sidi-fredj' 
  })
  @IsString()
  slug: string

  @ApiProperty({ 
    description: 'Type de lieu', 
    enum: PlaceType,
    example: PlaceType.BEACH 
  })
  @IsEnum(PlaceType)
  type: PlaceType

  @ApiProperty({ 
    description: 'Wilaya', 
    example: 'Alger' 
  })
  @IsString()
  wilaya: string

  @ApiProperty({ 
    description: 'Coordonnées GPS', 
    example: { lat: 36.7556, lng: 2.8572 } 
  })
  @IsObject()
  coords: { lat: number; lng: number }

  @ApiProperty({ 
    description: 'URL de l\'image de couverture', 
    example: 'https://example.com/cover.jpg',
    required: false 
  })
  @IsOptional()
  @IsString()
  coverUrl?: string

  @ApiProperty({ 
    description: 'Galerie d\'images', 
    example: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[]

  @ApiProperty({ 
    description: 'Horaires d\'ouverture', 
    example: { monday: { open: '09:00', close: '18:00' } },
    required: false 
  })
  @IsOptional()
  @IsObject()
  openHours?: any

  @ApiProperty({ 
    description: 'Indication de prix', 
    example: 'Gratuit',
    required: false 
  })
  @IsOptional()
  @IsString()
  priceHint?: string

  @ApiProperty({ 
    description: 'Tags', 
    example: ['family', 'sunset', 'restaurants'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({ 
    description: 'Note moyenne', 
    example: 4.6,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  ratingAgg?: number

  @ApiProperty({ 
    description: 'Nombre d\'avis', 
    example: 128,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  reviewCount?: number

  @ApiProperty({ 
    description: 'Notes de sécurité', 
    example: 'Plage surveillée en été, attention aux courants forts',
    required: false 
  })
  @IsOptional()
  @IsString()
  safetyNotes?: string
}