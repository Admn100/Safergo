import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { BookingStatus, Prisma } from '@prisma/client'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(userId: string, data: {
    tripId: string
    seats: number
  }) {
    // Check trip availability
    const trip = await this.prisma.trip.findUnique({
      where: { id: data.tripId },
      include: {
        driver: { include: { user: true } },
      },
    })

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé')
    }

    if (trip.status !== 'OPEN') {
      throw new BadRequestException('Ce trajet n\'est plus disponible')
    }

    if (trip.availableSeats < data.seats) {
      throw new BadRequestException(`Seulement ${trip.availableSeats} places disponibles`)
    }

    // Check if user is the driver
    if (trip.driver.userId === userId) {
      throw new BadRequestException('Vous ne pouvez pas réserver votre propre trajet')
    }

    // Check for existing booking
    const existingBooking = await this.prisma.booking.findUnique({
      where: {
        tripId_userId: {
          tripId: data.tripId,
          userId,
        },
      },
    })

    if (existingBooking) {
      throw new BadRequestException('Vous avez déjà une réservation pour ce trajet')
    }

    // Calculate total price
    const priceTotal = trip.pricePerSeat * data.seats

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        tripId: data.tripId,
        userId,
        seats: data.seats,
        priceTotal,
        currency: trip.currency,
        status: 'PENDING',
      },
      include: {
        trip: {
          include: {
            driver: { include: { user: true } },
            place: true,
            itinerary: true,
          },
        },
        user: true,
      },
    })

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'booking.create',
        entity: 'Booking',
        entityId: booking.id,
        meta: {
          tripId: data.tripId,
          seats: data.seats,
          amount: priceTotal,
        },
      },
    })

    return booking
  }

  async getUserBookings(userId: string, status?: BookingStatus, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit

    const where: Prisma.BookingWhereInput = {
      userId,
      ...(status && { status }),
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          trip: {
            include: {
              driver: { include: { user: true } },
              vehicle: true,
              place: true,
            },
          },
          payments: {
            select: {
              id: true,
              status: true,
              amount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ])

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: {
            driver: { include: { user: true } },
            vehicle: true,
            place: true,
            itinerary: {
              include: {
                stops: {
                  include: { place: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        user: true,
        payments: true,
        dispute: true,
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    // Check authorization
    if (booking.userId !== userId && booking.trip.driver.userId !== userId) {
      throw new ForbiddenException('Accès non autorisé')
    }

    return booking
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: true,
        payments: true,
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Vous ne pouvez annuler que vos propres réservations')
    }

    if (booking.status === 'CANCELLED' || booking.status === 'FINISHED') {
      throw new BadRequestException('Cette réservation ne peut pas être annulée')
    }

    // Check cancellation policy
    const hoursUntilTrip = (new Date(booking.trip.dateTime).getTime() - Date.now()) / (1000 * 60 * 60)
    
    if (hoursUntilTrip < 2 && booking.status === 'CONFIRMED') {
      throw new BadRequestException('Annulation impossible moins de 2h avant le départ')
    }

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
      },
    })

    // Restore available seats if booking was confirmed
    if (booking.status === 'HELD' || booking.status === 'CONFIRMED') {
      await this.prisma.trip.update({
        where: { id: booking.tripId },
        data: {
          availableSeats: { increment: booking.seats },
        },
      })
    }

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'booking.cancel',
        entity: 'Booking',
        entityId: bookingId,
        meta: {
          reason,
          previousStatus: booking.status,
          hoursUntilTrip,
        },
      },
    })

    return updatedBooking
  }

  async confirmBooking(bookingId: string, driverId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: { driver: true },
        },
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    if (booking.trip.driver.userId !== driverId) {
      throw new ForbiddenException('Seul le conducteur peut confirmer cette réservation')
    }

    if (booking.status !== 'HELD') {
      throw new BadRequestException('Cette réservation ne peut pas être confirmée')
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    })

    // Send notification to passenger
    await this.prisma.notification.create({
      data: {
        userId: booking.userId,
        channel: 'EMAIL',
        template: 'booking_confirmed_by_driver',
        payload: {
          bookingId,
          driverName: booking.trip.driver.user.name,
        },
        status: 'PENDING',
      },
    })

    return updatedBooking
  }

  async finishBooking(bookingId: string, driverId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: { include: { driver: true } },
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    if (booking.trip.driver.userId !== driverId) {
      throw new ForbiddenException('Seul le conducteur peut finaliser cette réservation')
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Cette réservation ne peut pas être finalisée')
    }

    // Check if trip date has passed
    if (new Date(booking.trip.dateTime) > new Date()) {
      throw new BadRequestException('Le trajet n\'est pas encore terminé')
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'FINISHED' },
    })

    // Trigger payment capture (will be handled by payment service)
    // In a real app, this would be done via a queue/event

    return updatedBooking
  }
}