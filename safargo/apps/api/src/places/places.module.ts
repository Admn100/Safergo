import { Module } from '@nestjs/common'
import { PlacesController } from './places.controller'
import { PlacesService } from './places.service'
import { ItinerariesController } from './itineraries.controller'
import { ItinerariesService } from './itineraries.service'

@Module({
  controllers: [PlacesController, ItinerariesController],
  providers: [PlacesService, ItinerariesService],
  exports: [PlacesService, ItinerariesService],
})
export class PlacesModule {}