import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PaymentStatus } from '@prisma/client'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(bookingId: string, amount: number, currency: string = 'DZD') {
    // In production, integrate with Stripe
    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        intentId: paymentIntentId,
        status: PaymentStatus.INTENT,
        amount,
        currency,
      },
    })

    return {
      paymentId: payment.id,
      intentId: paymentIntentId,
      clientSecret: `pi_${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
    }
  }

  async holdPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      throw new NotFoundException('Paiement non trouvé')
    }

    if (payment.status !== PaymentStatus.INTENT) {
      throw new BadRequestException('Paiement déjà traité')
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.HOLD },
    })
  }

  async capturePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      throw new NotFoundException('Paiement non trouvé')
    }

    if (payment.status !== PaymentStatus.HOLD) {
      throw new BadRequestException('Paiement non en attente de capture')
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.CAPTURED },
    })
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      throw new NotFoundException('Paiement non trouvé')
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new BadRequestException('Paiement déjà remboursé')
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    })
  }

  async getPaymentByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    })
  }
}