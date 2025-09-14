import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { StripeService } from './stripe.service'
import { NotificationService } from '../common/notification.service'

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
    private notifications: NotificationService,
  ) {}

  async createPaymentIntent(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: {
            driver: { include: { user: true } },
          },
        },
        user: true,
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Cette réservation a déjà été traitée')
    }

    // Get or create Stripe customer
    const customerId = await this.getOrCreateStripeCustomer(booking.user)

    // Create payment intent
    const paymentIntent = await this.stripe.createPaymentIntent({
      amount: booking.priceTotal,
      currency: booking.currency,
      customerId,
      metadata: {
        bookingId: booking.id,
        tripId: booking.tripId,
        userId: booking.userId,
        driverId: booking.trip.driver.userId,
      },
      description: `Trajet ${booking.trip.originLabel} → ${booking.trip.destinationLabel}`,
    })

    // Save payment in database
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        intentId: paymentIntent.id,
        status: 'INTENT',
        amount: booking.priceTotal,
        currency: booking.currency,
        provider: 'stripe',
        metadata: {
          client_secret: paymentIntent.client_secret,
        },
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      amount: booking.priceTotal,
      currency: booking.currency,
    }
  }

  async confirmPaymentHold(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true, trip: true },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    const payment = booking.payments[0]
    if (!payment) {
      throw new BadRequestException('Aucun paiement trouvé')
    }

    // Verify payment intent status
    const paymentIntent = await this.stripe.retrievePaymentIntent(payment.intentId)
    if (paymentIntent.status !== 'requires_capture') {
      throw new BadRequestException(`État invalide: ${paymentIntent.status}`)
    }

    // Update statuses in transaction
    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'HELD' },
      }),
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'HOLD' },
      }),
      this.prisma.trip.update({
        where: { id: booking.tripId },
        data: { availableSeats: { decrement: booking.seats } },
      }),
    ])

    // Send notifications
    await this.notifications.sendBookingConfirmed(booking)

    return { success: true, status: 'HELD' }
  }

  async capturePayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payments: true,
        trip: { include: { driver: true } },
      },
    })

    if (!booking || !booking.payments[0]) {
      throw new NotFoundException('Réservation ou paiement non trouvé')
    }

    const payment = booking.payments[0]
    if (payment.status !== 'HOLD') {
      throw new BadRequestException('Paiement non disponible pour capture')
    }

    // Capture payment
    const captured = await this.stripe.capturePaymentIntent(payment.intentId)
    if (captured.status !== 'succeeded') {
      throw new BadRequestException('Échec de la capture')
    }

    // Calculate fees
    const platformFee = booking.priceTotal * 0.10
    const driverAmount = booking.priceTotal - platformFee

    // Update database
    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'FINISHED' },
      }),
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'CAPTURED',
          metadata: {
            ...payment.metadata as any,
            platform_fee: platformFee,
            driver_amount: driverAmount,
          },
        },
      }),
    ])

    // Send notifications
    await this.notifications.sendPaymentCaptured(booking, driverAmount)

    return {
      success: true,
      amount: booking.priceTotal,
      driverAmount,
      platformFee,
    }
  }

  async refundPayment(bookingId: string, reason: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true, trip: true },
    })

    if (!booking || !booking.payments[0]) {
      throw new NotFoundException('Réservation ou paiement non trouvé')
    }

    const payment = booking.payments[0]
    let refundAmount = booking.priceTotal

    // Apply cancellation policy
    const hoursUntilTrip = (new Date(booking.trip.dateTime).getTime() - Date.now()) / (1000 * 60 * 60)
    
    if (payment.status === 'CAPTURED') {
      if (hoursUntilTrip < 2) {
        throw new BadRequestException('Annulation impossible < 2h')
      } else if (hoursUntilTrip < 24) {
        refundAmount = booking.priceTotal * 0.9 // 10% fee
      }

      await this.stripe.createRefund(payment.intentId, refundAmount, {
        bookingId: booking.id,
        reason,
      })
    } else if (payment.status === 'HOLD') {
      await this.stripe.cancelPaymentIntent(payment.intentId)
    }

    // Update database
    await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      }),
      this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      }),
      this.prisma.trip.update({
        where: { id: booking.tripId },
        data: { availableSeats: { increment: booking.seats } },
      }),
    ])

    await this.notifications.sendRefund(booking, refundAmount)

    return { success: true, refundAmount }
  }

  private async getOrCreateStripeCustomer(user: any): Promise<string> {
    const metadata = user.metadata as any
    if (metadata?.stripe_customer_id) {
      return metadata.stripe_customer_id
    }

    const customer = await this.stripe.createCustomer({
      email: user.email,
      name: user.name,
      phone: user.phone,
      metadata: { userId: user.id },
    })

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          stripe_customer_id: customer.id,
        },
      },
    })

    return customer.id
  }
}