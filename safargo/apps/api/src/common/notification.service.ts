import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async sendBookingConfirmed(booking: any) {
    await this.prisma.notification.createMany({
      data: [
        {
          userId: booking.userId,
          channel: 'EMAIL',
          template: 'booking_confirmed',
          payload: {
            bookingId: booking.id,
            tripOrigin: booking.trip.originLabel,
            tripDestination: booking.trip.destinationLabel,
            tripDate: booking.trip.dateTime,
            seats: booking.seats,
            amount: booking.priceTotal,
          },
          status: 'PENDING',
        },
        {
          userId: booking.trip.driver.userId,
          channel: 'EMAIL',
          template: 'new_passenger',
          payload: {
            bookingId: booking.id,
            passengerName: booking.user.name,
            seats: booking.seats,
            tripDate: booking.trip.dateTime,
          },
          status: 'PENDING',
        },
      ],
    })
  }

  async sendPaymentCaptured(booking: any, driverAmount: number) {
    await this.prisma.notification.createMany({
      data: [
        {
          userId: booking.userId,
          channel: 'EMAIL',
          template: 'payment_receipt',
          payload: {
            bookingId: booking.id,
            amount: booking.priceTotal,
            tripDetails: `${booking.trip.originLabel} → ${booking.trip.destinationLabel}`,
          },
          status: 'PENDING',
        },
        {
          userId: booking.trip.driver.userId,
          channel: 'EMAIL',
          template: 'payment_received',
          payload: {
            bookingId: booking.id,
            amount: driverAmount,
            passengerName: booking.user.name,
          },
          status: 'PENDING',
        },
      ],
    })
  }

  async sendRefund(booking: any, refundAmount: number) {
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        channel: 'EMAIL',
        template: 'refund_processed',
        payload: {
          bookingId: booking.id,
          refundAmount,
          originalAmount: booking.priceTotal,
          tripDetails: `${booking.trip.originLabel} → ${booking.trip.destinationLabel}`,
        },
        status: 'PENDING',
      },
    })
  }

  async sendOTP(userId: string, channel: 'EMAIL' | 'SMS', destination: string, code: string, locale: string) {
    await this.prisma.notification.create({
      data: {
        userId,
        channel,
        template: 'otp_code',
        payload: {
          destination,
          code,
          locale,
          expiresIn: '10 minutes',
        },
        status: 'PENDING',
      },
    })
  }

  async sendTripReminder(booking: any) {
    const hoursBeforeTrip = 2
    const reminderTime = new Date(booking.trip.dateTime)
    reminderTime.setHours(reminderTime.getHours() - hoursBeforeTrip)

    await this.prisma.notification.createMany({
      data: [
        {
          userId: booking.userId,
          channel: 'EMAIL',
          template: 'trip_reminder',
          payload: {
            bookingId: booking.id,
            tripTime: booking.trip.dateTime,
            driverName: booking.trip.driver.user.name,
            driverPhone: booking.trip.driver.user.phone,
            meetingPoint: booking.trip.originLabel,
          },
          status: 'PENDING',
          scheduledFor: reminderTime,
        },
        {
          userId: booking.trip.driver.userId,
          channel: 'SMS',
          template: 'trip_reminder_driver',
          payload: {
            tripTime: booking.trip.dateTime,
            passengersCount: booking.trip.bookings.length,
          },
          status: 'PENDING',
          scheduledFor: reminderTime,
        },
      ],
    })
  }
}