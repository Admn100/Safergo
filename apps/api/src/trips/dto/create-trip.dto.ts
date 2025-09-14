import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsNumber, IsObject, IsEnum, IsDateString, Min, Max } from 'class-validator'
import { TripStatus } from '@prisma/client'

export class CreateTripDto {
  @ApiProperty({ 
    description: 'Point de départ', 
    example: { lat: 36.7833, lng: 3.0667, label: 'Alger Centre' } 
  })
  @IsObject()
  origin: { lat: number; lng: number; label: string }

  @ApiProperty({ 
    description: 'Point d\'arrivée', 
    example: { lat: 36.3667, lng: 6.6167, label: 'Constantine' } 
  })
  @IsObject()
  destination: { lat: number; lng: number; label: string }

  @ApiProperty({ 
    description: 'Date et heure de départ', 
    example: '2024-06-15T08:00:00Z' 
  })
  @IsDateString()
  dateTime: string

  @ApiProperty({ 
    description: 'Nombre de places disponibles', 
    example: 3,
    minimum: 1,
    maximum: 8 
  })
  @IsNumber()
  @Min(1)
  @Max(8)
  seats: number

  @ApiProperty({ 
    description: 'Prix par place en DZD', 
    example: 500,
    minimum: 0 
  })
  @IsNumber()
  @Min(0)
  pricePerSeat: number

  @ApiProperty({ 
    description: 'Règles du trajet', 
    example: ['Non-fumeur', 'Bagages légers'],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[]

  @ApiProperty({ 
    description: 'Statut du trajet', 
    enum: TripStatus,
    example: TripStatus.DRAFT,
    required: false 
  })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus

  @ApiProperty({ 
    description: 'ID du lieu touristique (mode tourisme)', 
    example: 'place-id-123',
    required: false 
  })
  @IsOptional()
  @IsString()
  placeId?: string

  @ApiProperty({ 
    description: 'ID de l\'itinéraire (mode tourisme)', 
    example: 'itinerary-id-123',
    required: false 
  })
  @IsOptional()
  @IsString()
  itineraryId?: string
}