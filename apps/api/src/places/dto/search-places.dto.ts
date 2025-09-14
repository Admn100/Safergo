import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'
import { PlaceType } from '@prisma/client'

export class SearchPlacesDto {
  @ApiProperty({ 
    description: 'Type de lieu', 
    enum: PlaceType,
    required: false 
  })
  @IsOptional()
  @IsEnum(PlaceType)
  type?: PlaceType

  @ApiProperty({ 
    description: 'Wilaya', 
    example: 'Alger',
    required: false 
  })
  @IsOptional()
  @IsString()
  wilaya?: string

  @ApiProperty({ 
    description: 'Terme de recherche', 
    example: 'plage',
    required: false 
  })
  @IsOptional()
  @IsString()
  q?: string

  @ApiProperty({ 
    description: 'Coordonnées pour recherche géographique (lat,lng)', 
    example: '36.7556,2.8572',
    required: false 
  })
  @IsOptional()
  @IsString()
  near?: string

  @ApiProperty({ 
    description: 'Rayon de recherche en kilomètres', 
    example: 50,
    required: false,
    minimum: 1,
    maximum: 500 
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(500)
  radiusKm?: number

  @ApiProperty({ 
    description: 'Critère de tri', 
    enum: ['rating', 'popularity', 'name'],
    example: 'rating',
    required: false 
  })
  @IsOptional()
  @IsEnum(['rating', 'popularity', 'name'])
  sort?: 'rating' | 'popularity' | 'name'
}