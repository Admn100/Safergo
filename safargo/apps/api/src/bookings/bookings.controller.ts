import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { PaymentsService } from '../payments/payments.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BookingStatus } from '@prisma/client'

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(
    private bookingsService: BookingsService,
    private paymentsService: PaymentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  async createBooking(
    @Request() req,
    @Body() body: { tripId: string; seats: number },
  ) {
    const booking = await this.bookingsService.createBooking(req.user.id, body)
    
    // Automatically create payment intent
    const paymentIntent = await this.paymentsService.createPaymentIntent(booking.id)
    
    return {
      booking,
      payment: paymentIntent,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes réservations' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async getUserBookings(
    @Request() req,
    @Query('status') status?: BookingStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.getUserBookings(
      req.user.id,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une réservation' })
  @ApiResponse({ status: 200, description: 'Détails de la réservation' })
  async getBooking(@Param('id') id: string, @Request() req) {
    return this.bookingsService.getBooking(id, req.user.id)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  async cancelBooking(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { reason?: string },
  ) {
    const booking = await this.bookingsService.cancelBooking(id, req.user.id, body.reason)
    
    // Trigger refund if payment was held
    const bookingWithPayments = await this.bookingsService.getBooking(id, req.user.id)
    if (bookingWithPayments.payments.length > 0 && 
        (bookingWithPayments.payments[0].status === 'HOLD' || 
         bookingWithPayments.payments[0].status === 'CAPTURED')) {
      await this.paymentsService.refundPayment(id, body.reason || 'Annulation par le passager')
    }
    
    return booking
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirmer une réservation (conducteur)' })
  @ApiResponse({ status: 200, description: 'Réservation confirmée' })
  async confirmBooking(@Param('id') id: string, @Request() req) {
    return this.bookingsService.confirmBooking(id, req.user.id)
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Finaliser une réservation (conducteur)' })
  @ApiResponse({ status: 200, description: 'Réservation finalisée' })
  async finishBooking(@Param('id') id: string, @Request() req) {
    const booking = await this.bookingsService.finishBooking(id, req.user.id)
    
    // Trigger payment capture
    await this.paymentsService.capturePayment(id)
    
    return booking
  }
}