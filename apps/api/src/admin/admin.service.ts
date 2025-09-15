import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private checkAdminAccess(user: User) {
    if (!user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Accès refusé');
    }
  }

  async getUsers(user: User) {
    this.checkAdminAccess(user);

    return this.prisma.user.findMany({
      include: {
        driverProfile: true,
        _count: {
          select: {
            bookings: true,
            reviewsGiven: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTrips(user: User) {
    this.checkAdminAccess(user);

    return this.prisma.trip.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        bookings: true,
        place: true,
        itinerary: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBookings(user: User) {
    this.checkAdminAccess(user);

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

  async getPlaces(user: User) {
    this.checkAdminAccess(user);

    return this.prisma.place.findMany({
      include: {
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getItineraries(user: User) {
    this.checkAdminAccess(user);

    return this.prisma.itinerary.findMany({
      include: {
        stops: {
          include: {
            place: true,
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStats(user: User) {
    this.checkAdminAccess(user);

    const [
      totalUsers,
      totalTrips,
      totalBookings,
      totalPlaces,
      totalItineraries,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.trip.count(),
      this.prisma.booking.count(),
      this.prisma.place.count(),
      this.prisma.itinerary.count(),
    ]);

    return {
      totalUsers,
      totalTrips,
      totalBookings,
      totalPlaces,
      totalItineraries,
    };
  }
}