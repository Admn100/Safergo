import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, Min, Max } from 'class-validator'

export class CreateBookingDto {
  @ApiProperty({ 
    description: 'ID du trajet', 
    example: 'trip-id-123' 
  })
  @IsString()
  tripId: string

  @ApiProperty({ 
    description: 'Nombre de places à réserver', 
    example: 2,
    minimum: 1,
    maximum: 8 
  })
  @IsNumber()
  @Min(1)
  @Max(8)
  seats: number
}