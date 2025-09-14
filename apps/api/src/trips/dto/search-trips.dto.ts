import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator'
import { Transform } from 'class-transformer'

export class SearchTripsDto {
  @ApiProperty({ 
    description: 'Ville de départ', 
    example: 'Alger',
    required: false 
  })
  @IsOptional()
  @IsString()
  origin?: string

  @ApiProperty({ 
    description: 'Ville d\'arrivée', 
    example: 'Constantine',
    required: false 
  })
  @IsOptional()
  @IsString()
  destination?: string

  @ApiProperty({ 
    description: 'Date de départ (YYYY-MM-DD)', 
    example: '2024-06-15',
    required: false 
  })
  @IsOptional()
  @IsString()
  date?: string

  @ApiProperty({ 
    description: 'Nombre de places requises', 
    example: 2,
    required: false,
    minimum: 1,
    maximum: 8 
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(8)
  seats?: number

  @ApiProperty({ 
    description: 'Prix maximum par place', 
    example: 1000,
    required: false,
    minimum: 0 
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number

  @ApiProperty({ 
    description: 'Critère de tri', 
    enum: ['date', 'price', 'seats'],
    example: 'date',
    required: false 
  })
  @IsOptional()
  @IsEnum(['date', 'price', 'seats'])
  sort?: 'date' | 'price' | 'seats'
}