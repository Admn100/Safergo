import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User, BookingStatus } from '@prisma/client'

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.create(createBookingDto, user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir toutes les réservations' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async findAll() {
    return this.bookingsService.findAll()
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir mes réservations' })
  @ApiResponse({ status: 200, description: 'Mes réservations' })
  async getMyBookings(@CurrentUser() user: User) {
    return this.bookingsService.getByUser(user.id)
  }

  @Get('trip/:tripId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les réservations d\'un trajet' })
  @ApiResponse({ status: 200, description: 'Réservations du trajet' })
  async getByTrip(@Param('tripId') tripId: string) {
    return this.bookingsService.getByTrip(tripId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir une réservation par ID' })
  @ApiResponse({ status: 200, description: 'Réservation trouvée' })
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id)
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmer une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation confirmée' })
  async confirm(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.confirm(id, user)
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.cancel(id, user)
  }

  @Patch(':id/finish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer une réservation comme terminée' })
  @ApiResponse({ status: 200, description: 'Réservation terminée' })
  async finish(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.finish(id, user)
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une réservation' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @CurrentUser() user: User
  ) {
    return this.bookingsService.updateStatus(id, status, user)
  }
}