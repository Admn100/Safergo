import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsEnum, IsObject, IsNumber, Min } from 'class-validator'
import { Seasonality } from '@prisma/client'

export class CreateItineraryDto {
  @ApiProperty({ 
    description: 'Titre de l\'itinéraire', 
    example: 'Côte & Plages d\'Alger' 
  })
  @IsString()
  title: string

  @ApiProperty({ 
    description: 'Description de l\'itinéraire', 
    example: 'Découvrez les plus belles plages de la région d\'Alger' 
  })
  @IsString()
  description: string

  @ApiProperty({ 
    description: 'URL de l\'image de couverture', 
    example: 'https://example.com/itinerary-cover.jpg',
    required: false 
  })
  @IsOptional()
  @IsString()
  coverUrl?: string

  @ApiProperty({ 
    description: 'Indication de durée', 
    example: '1-2 jours',
    required: false 
  })
  @IsOptional()
  @IsString()
  durationHint?: string

  @ApiProperty({ 
    description: 'Saisonnalité', 
    enum: Seasonality,
    example: Seasonality.SUMMER,
    required: false 
  })
  @IsOptional()
  @IsEnum(Seasonality)
  seasonality?: Seasonality

  @ApiProperty({ 
    description: 'Difficulté', 
    example: 'Facile',
    required: false 
  })
  @IsOptional()
  @IsString()
  difficulty?: string

  @ApiProperty({ 
    description: 'Tags', 
    example: ['family', 'sea', 'relaxation'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiProperty({ 
    description: 'Étapes de l\'itinéraire', 
    example: [
      { placeId: 'place-id-1', order: 1, dwellMin: 120 },
      { placeId: 'place-id-2', order: 2, dwellMin: 90 }
    ] 
  })
  @IsArray()
  @IsObject({ each: true })
  stops: Array<{
    placeId: string
    order: number
    dwellMin: number
  }>
}