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
import { TripsService } from './trips.service'
import { CreateTripDto } from './dto/create-trip.dto'
import { UpdateTripDto } from './dto/update-trip.dto'
import { SearchTripsDto } from './dto/search-trips.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, TripStatus } from '@prisma/client'

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un trajet' })
  @ApiResponse({ status: 201, description: 'Trajet créé avec succès' })
  async create(
    @Body() createTripDto: CreateTripDto,
    @CurrentUser() user: User
  ) {
    return this.tripsService.create(createTripDto, user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les trajets' })
  @ApiResponse({ status: 200, description: 'Liste des trajets' })
  async findAll() {
    return this.tripsService.findAll()
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des trajets' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  @ApiQuery({ name: 'origin', required: false, description: 'Ville de départ' })
  @ApiQuery({ name: 'destination', required: false, description: 'Ville d\'arrivée' })
  @ApiQuery({ name: 'date', required: false, description: 'Date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'seats', required: false, description: 'Nombre de places' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Prix maximum par place' })
  @ApiQuery({ name: 'sort', required: false, enum: ['date', 'price', 'seats'], description: 'Tri' })
  async search(@Query() searchTripsDto: SearchTripsDto) {
    return this.tripsService.search(searchTripsDto)
  }

  @Get('tourism')
  @ApiOperation({ summary: 'Obtenir les trajets touristiques' })
  @ApiResponse({ status: 200, description: 'Trajets touristiques' })
  async getTourismTrips() {
    return this.tripsService.getTourismTrips()
  }

  @Get('driver/:driverId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les trajets d\'un conducteur' })
  @ApiResponse({ status: 200, description: 'Trajets du conducteur' })
  async getByDriver(@Param('driverId') driverId: string) {
    return this.tripsService.getByDriver(driverId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un trajet par ID' })
  @ApiResponse({ status: 200, description: 'Trajet trouvé' })
  async findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un trajet' })
  @ApiResponse({ status: 200, description: 'Trajet mis à jour avec succès' })
  async update(
    @Param('id') id: string, 
    @Body() updateTripDto: UpdateTripDto,
    @CurrentUser() user: User
  ) {
    return this.tripsService.update(id, updateTripDto, user)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un trajet' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour avec succès' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: TripStatus,
    @CurrentUser() user: User
  ) {
    return this.tripsService.updateStatus(id, status, user)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un trajet' })
  @ApiResponse({ status: 200, description: 'Trajet supprimé avec succès' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    await this.tripsService.remove(id, user)
    return { message: 'Trajet supprimé avec succès' }
  }
}