import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { Booking, BookingStatus, User } from '@prisma/client'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { tripId, seats } = createBookingDto

    // Check if trip exists and is available
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: true,
      },
    })

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé')
    }

    if (trip.status !== 'OPEN') {
      throw new BadRequestException('Ce trajet n\'est pas disponible pour réservation')
    }

    // Check available seats
    const bookedSeats = trip.bookings.reduce((total, booking) => {
      return total + (booking.status === 'CONFIRMED' ? booking.seats : 0)
    }, 0)

    if (bookedSeats + seats > trip.seats) {
      throw new BadRequestException('Pas assez de places disponibles')
    }

    // Calculate total price
    const priceTotal = seats * trip.pricePerSeat

    return this.prisma.booking.create({
      data: {
        tripId,
        userId,
        seats,
        priceTotal,
        status: BookingStatus.PENDING,
      },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: true,
              },
            },
            vehicle: true,
          },
        },
        user: true,
      },
    })
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: true,
              },
            },
            vehicle: true,
          },
        },
        user: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne(id: string): Promise<any> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: true,
            },
            },
            vehicle: true,
          },
        },
        user: true,
        payments: true,
        disputes: true,
      },
    })

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée')
    }

    return booking
  }

  async updateStatus(id: string, status: BookingStatus, user: User): Promise<Booking> {
    const booking = await this.findOne(id)

    // Check permissions
    const isDriver = booking.trip.driverId === user.id
    const isPassenger = booking.userId === user.id
    const isAdmin = user.roles.includes('ADMIN')

    if (!isDriver && !isPassenger && !isAdmin) {
      throw new ForbiddenException('Vous ne pouvez pas modifier cette réservation')
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: true,
              },
            },
            vehicle: true,
          },
        },
        user: true,
        payments: true,
      },
    })
  }

  async confirm(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id)

    // Only driver can confirm
    if (booking.trip.driverId !== user.id) {
      throw new ForbiddenException('Seul le conducteur peut confirmer cette réservation')
    }

    return this.updateStatus(id, BookingStatus.CONFIRMED, user)
  }

  async cancel(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id)

    // Driver or passenger can cancel
    const isDriver = booking.trip.driverId === user.id
    const isPassenger = booking.userId === user.id

    if (!isDriver && !isPassenger) {
      throw new ForbiddenException('Vous ne pouvez pas annuler cette réservation')
    }

    return this.updateStatus(id, BookingStatus.CANCELLED, user)
  }

  async finish(id: string, user: User): Promise<Booking> {
    const booking = await this.findOne(id)

    // Only driver can mark as finished
    if (booking.trip.driverId !== user.id) {
      throw new ForbiddenException('Seul le conducteur peut marquer cette réservation comme terminée')
    }

    return this.updateStatus(id, BookingStatus.FINISHED, user)
  }

  async getByUser(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: true,
              },
            },
            vehicle: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getByTrip(tripId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { tripId },
      include: {
        user: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }
}