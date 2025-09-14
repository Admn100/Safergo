import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum } from 'class-validator'
import { Seasonality } from '@prisma/client'

export class SearchItinerariesDto {
  @ApiProperty({ 
    description: 'Saisonnalité', 
    enum: Seasonality,
    required: false 
  })
  @IsOptional()
  @IsEnum(Seasonality)
  seasonality?: Seasonality

  @ApiProperty({ 
    description: 'Tag', 
    example: 'family',
    required: false 
  })
  @IsOptional()
  @IsString()
  tag?: string

  @ApiProperty({ 
    description: 'Difficulté', 
    example: 'Facile',
    required: false 
  })
  @IsOptional()
  @IsString()
  difficulty?: string
}