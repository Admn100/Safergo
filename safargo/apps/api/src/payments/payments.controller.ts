import { Controller, Post, Body, Param, UseGuards, Request, Headers, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import { WebhookService } from './webhook.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private webhookService: WebhookService,
  ) {}

  @Post('bookings/:bookingId/intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un payment intent pour une réservation' })
  @ApiResponse({ status: 201, description: 'Payment intent créé' })
  async createPaymentIntent(@Param('bookingId') bookingId: string) {
    return this.paymentsService.createPaymentIntent(bookingId)
  }

  @Post('bookings/:bookingId/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmer le hold du paiement' })
  @ApiResponse({ status: 200, description: 'Paiement mis en hold' })
  async confirmPaymentHold(@Param('bookingId') bookingId: string) {
    return this.paymentsService.confirmPaymentHold(bookingId)
  }

  @Post('bookings/:bookingId/capture')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Capturer le paiement après le trajet' })
  @ApiResponse({ status: 200, description: 'Paiement capturé' })
  async capturePayment(@Param('bookingId') bookingId: string) {
    return this.paymentsService.capturePayment(bookingId)
  }

  @Post('bookings/:bookingId/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rembourser une réservation' })
  @ApiResponse({ status: 200, description: 'Remboursement effectué' })
  async refundPayment(
    @Param('bookingId') bookingId: string,
    @Body() body: { reason: string },
  ) {
    return this.paymentsService.refundPayment(bookingId, body.reason)
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook Stripe' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: Buffer,
  ) {
    return this.webhookService.handleStripeWebhook(signature, payload)
  }
}