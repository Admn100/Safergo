import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { StripeService } from './stripe.service'
import Stripe from 'stripe'

@Injectable()
export class WebhookService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
  ) {}

  async handleStripeWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event

    try {
      event = this.stripe.constructWebhookEvent(payload, signature)
    } catch (err) {
      throw new BadRequestException('Invalid webhook signature')
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.dispute.created':
        await this.handleDisputeCreated(event.data.object as Stripe.Dispute)
        break

      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled webhook event: ${event.type}`)
    }

    return { received: true }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId
    
    if (bookingId) {
      await this.prisma.auditLog.create({
        data: {
          actorId: 'stripe-webhook',
          action: 'payment_intent.succeeded',
          entity: 'Booking',
          entityId: bookingId,
          meta: {
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount / 100,
          },
        },
      })
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId
    
    if (bookingId) {
      // Cancel the booking
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      })

      // Update payment status
      const payment = await this.prisma.payment.findFirst({
        where: { intentId: paymentIntent.id },
      })

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            metadata: {
              ...payment.metadata as any,
              failure_reason: paymentIntent.last_payment_error?.message,
            },
          },
        })
      }

      // Send notification
      await this.prisma.notification.create({
        data: {
          userId: paymentIntent.metadata.userId,
          channel: 'EMAIL',
          template: 'payment_failed',
          payload: {
            bookingId,
            reason: paymentIntent.last_payment_error?.message,
          },
          status: 'PENDING',
        },
      })
    }
  }

  private async handleDisputeCreated(dispute: Stripe.Dispute) {
    const paymentIntentId = dispute.payment_intent as string
    const payment = await this.prisma.payment.findUnique({
      where: { intentId: paymentIntentId },
      include: { booking: true },
    })

    if (payment) {
      // Create dispute record
      await this.prisma.dispute.create({
        data: {
          bookingId: payment.bookingId,
          reason: dispute.reason || 'Litige bancaire',
          status: 'OPEN',
          metadata: {
            stripe_dispute_id: dispute.id,
            amount: dispute.amount / 100,
            evidence_due_by: dispute.evidence_details?.due_by,
          },
        },
      })

      // Notify admin
      await this.prisma.notification.create({
        data: {
          userId: 'admin',
          channel: 'EMAIL',
          template: 'dispute_created',
          payload: {
            bookingId: payment.bookingId,
            disputeId: dispute.id,
            amount: dispute.amount / 100,
          },
          status: 'PENDING',
        },
      })
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string
    const payment = await this.prisma.payment.findUnique({
      where: { intentId: paymentIntentId },
    })

    if (payment) {
      await this.prisma.auditLog.create({
        data: {
          actorId: 'stripe-webhook',
          action: 'charge.refunded',
          entity: 'Payment',
          entityId: payment.id,
          meta: {
            charge_id: charge.id,
            amount_refunded: charge.amount_refunded / 100,
          },
        },
      })
    }
  }
}