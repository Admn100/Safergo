import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ItinerariesService } from './itineraries.service'

@ApiTags('places')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private itinerariesService: ItinerariesService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des itinéraires touristiques' })
  @ApiQuery({ name: 'seasonality', required: false, enum: ['SUMMER', 'WINTER', 'ALL'] })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des itinéraires' })
  async searchItineraries(@Query() query: any) {
    return this.itinerariesService.searchItineraries(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un itinéraire par ID' })
  @ApiResponse({ status: 200, description: 'Détails de l\'itinéraire' })
  @ApiResponse({ status: 404, description: 'Itinéraire non trouvé' })
  async getItinerary(@Param('id') id: string) {
    return this.itinerariesService.getItinerary(id)
  }
}