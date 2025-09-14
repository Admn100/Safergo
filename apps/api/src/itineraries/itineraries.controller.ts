import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ItinerariesService } from './itineraries.service'
import { CreateItineraryDto } from './dto/create-itinerary.dto'
import { UpdateItineraryDto } from './dto/update-itinerary.dto'
import { SearchItinerariesDto } from './dto/search-itineraries.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Seasonality } from '@prisma/client'

@ApiTags('itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un itinéraire' })
  @ApiResponse({ status: 201, description: 'Itinéraire créé avec succès' })
  async create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itinerariesService.create(createItineraryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les itinéraires' })
  @ApiResponse({ status: 200, description: 'Liste des itinéraires' })
  async findAll() {
    return this.itinerariesService.findAll()
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des itinéraires' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiQuery({ name: 'seasonality', required: false, enum: Seasonality, description: 'Saisonnalité' })
  @ApiQuery({ name: 'tag', required: false, description: 'Tag' })
  @ApiQuery({ name: 'difficulty', required: false, description: 'Difficulté' })
  async search(@Query() searchItinerariesDto: SearchItinerariesDto) {
    return this.itinerariesService.search(searchItinerariesDto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un itinéraire par ID' })
  @ApiResponse({ status: 200, description: 'Itinéraire trouvé' })
  async findOne(@Param('id') id: string) {
    return this.itinerariesService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un itinéraire' })
  @ApiResponse({ status: 200, description: 'Itinéraire mis à jour avec succès' })
  async update(@Param('id') id: string, @Body() updateItineraryDto: UpdateItineraryDto) {
    return this.itinerariesService.update(id, updateItineraryDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un itinéraire' })
  @ApiResponse({ status: 200, description: 'Itinéraire supprimé avec succès' })
  async remove(@Param('id') id: string) {
    await this.itinerariesService.remove(id)
    return { message: 'Itinéraire supprimé avec succès' }
  }
}