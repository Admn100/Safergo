import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<any> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBookingDto.tripId },
      include: {
        bookings: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé');
    }

    const totalBookedSeats = trip.bookings.reduce((sum, booking) => sum + booking.seats, 0);
    
    if (totalBookedSeats + createBookingDto.seats > trip.seats) {
      throw new ForbiddenException('Pas assez de places disponibles');
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
        status: 'PENDING',
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
        payments: true,
        disputes: true,
      },
    });
  }

  async findAll() {
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
        disputes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}