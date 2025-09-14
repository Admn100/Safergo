import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { TripsService } from './trips.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateTripDto, SearchTripsDto, createTripSchema, searchTripsSchema } from '@safargo/shared'
import { ZodValidationPipe } from 'nestjs-zod'
import { TripStatus } from '@prisma/client'

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des trajets' })
  @ApiResponse({ status: 200, description: 'Liste des trajets' })
  async searchTrips(
    @Query(new ZodValidationPipe(searchTripsSchema)) query: SearchTripsDto,
  ) {
    return this.tripsService.searchTrips(query)
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un trajet' })
  @ApiResponse({ status: 201, description: 'Trajet créé' })
  async createTrip(
    @Request() req,
    @Body(new ZodValidationPipe(createTripSchema)) dto: CreateTripDto,
  ) {
    return this.tripsService.createTrip(req.user.driver.id, dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un trajet' })
  @ApiResponse({ status: 200, description: 'Détails du trajet' })
  @ApiResponse({ status: 404, description: 'Trajet non trouvé' })
  async getTrip(@Param('id') id: string) {
    return this.tripsService.getTrip(id)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier le statut d\'un trajet' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  async updateTripStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { status: TripStatus },
  ) {
    return this.tripsService.updateTripStatus(id, req.user.driver.id, body.status)
  }
}