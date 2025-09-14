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
import { PlacesService } from './places.service'
import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'
import { SearchPlacesDto } from './dto/search-places.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PlaceType } from '@prisma/client'

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un lieu touristique' })
  @ApiResponse({ status: 201, description: 'Lieu créé avec succès' })
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placesService.create(createPlaceDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les lieux touristiques' })
  @ApiResponse({ status: 200, description: 'Liste des lieux' })
  async findAll() {
    return this.placesService.findAll()
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des lieux touristiques' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiQuery({ name: 'type', required: false, enum: PlaceType, description: 'Type de lieu' })
  @ApiQuery({ name: 'wilaya', required: false, description: 'Wilaya' })
  @ApiQuery({ name: 'q', required: false, description: 'Terme de recherche' })
  @ApiQuery({ name: 'near', required: false, description: 'Coordonnées (lat,lng)' })
  @ApiQuery({ name: 'radiusKm', required: false, description: 'Rayon de recherche en km' })
  @ApiQuery({ name: 'sort', required: false, enum: ['rating', 'popularity', 'name'], description: 'Tri' })
  async search(@Query() searchPlacesDto: SearchPlacesDto) {
    return this.placesService.search(searchPlacesDto)
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Obtenir les lieux par type' })
  @ApiResponse({ status: 200, description: 'Lieux du type spécifié' })
  async getByType(@Param('type') type: PlaceType) {
    return this.placesService.getByType(type)
  }

  @Get('wilaya/:wilaya')
  @ApiOperation({ summary: 'Obtenir les lieux par wilaya' })
  @ApiResponse({ status: 200, description: 'Lieux de la wilaya spécifiée' })
  async getByWilaya(@Param('wilaya') wilaya: string) {
    return this.placesService.getByWilaya(wilaya)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtenir un lieu par slug' })
  @ApiResponse({ status: 200, description: 'Lieu trouvé' })
  async findBySlug(@Param('slug') slug: string) {
    return this.placesService.findBySlug(slug)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un lieu par ID' })
  @ApiResponse({ status: 200, description: 'Lieu trouvé' })
  async findOne(@Param('id') id: string) {
    return this.placesService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un lieu' })
  @ApiResponse({ status: 200, description: 'Lieu mis à jour avec succès' })
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un lieu' })
  @ApiResponse({ status: 200, description: 'Lieu supprimé avec succès' })
  async remove(@Param('id') id: string) {
    await this.placesService.remove(id)
    return { message: 'Lieu supprimé avec succès' }
  }
}