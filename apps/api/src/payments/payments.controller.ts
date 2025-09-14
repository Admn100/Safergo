import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une intention de paiement' })
  @ApiResponse({ status: 201, description: 'Intention de paiement créée' })
  async createPaymentIntent(
    @Body() body: { bookingId: string; amount: number; currency?: string }
  ) {
    return this.paymentsService.createPaymentIntent(
      body.bookingId,
      body.amount,
      body.currency
    )
  }

  @Post(':id/hold')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre en attente un paiement' })
  @ApiResponse({ status: 200, description: 'Paiement mis en attente' })
  async holdPayment(@Param('id') id: string) {
    return this.paymentsService.holdPayment(id)
  }

  @Post(':id/capture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Capturer un paiement' })
  @ApiResponse({ status: 200, description: 'Paiement capturé' })
  async capturePayment(@Param('id') id: string) {
    return this.paymentsService.capturePayment(id)
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rembourser un paiement' })
  @ApiResponse({ status: 200, description: 'Paiement remboursé' })
  async refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id)
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les paiements d\'une réservation' })
  @ApiResponse({ status: 200, description: 'Paiements de la réservation' })
  async getPaymentByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentByBooking(bookingId)
  }
}