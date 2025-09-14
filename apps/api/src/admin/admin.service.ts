import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private checkAdminAccess(user: User) {
    if (!user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Accès administrateur requis')
    }
  }

  async getDashboard(user: User) {
    this.checkAdminAccess(user)

    const [
      totalUsers,
      totalDrivers,
      totalTrips,
      totalBookings,
      totalPlaces,
      totalItineraries,
      recentUsers,
      recentTrips,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.driver.count(),
      this.prisma.trip.count(),
      this.prisma.booking.count(),
      this.prisma.place.count(),
      this.prisma.itinerary.count(),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      this.prisma.trip.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          driver: {
            include: {
              user: true,
            },
          },
        },
      }),
    ])

    return {
      stats: {
        totalUsers,
        totalDrivers,
        totalTrips,
        totalBookings,
        totalPlaces,
        totalItineraries,
      },
      recentUsers,
      recentTrips,
    }
  }

  async getUsers(user: User) {
    this.checkAdminAccess(user)

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
    })
  }

  async getTrips(user: User) {
    this.checkAdminAccess(user)

    return this.prisma.trip.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        place: true,
        itinerary: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getBookings(user: User) {
    this.checkAdminAccess(user)

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
    })
  }

  async getDisputes(user: User) {
    this.checkAdminAccess(user)

    return this.prisma.dispute.findMany({
      include: {
        booking: {
          include: {
            trip: {
              include: {
                driver: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getPlaces(user: User) {
    this.checkAdminAccess(user)

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
    })
  }

  async getItineraries(user: User) {
    this.checkAdminAccess(user)

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
    })
  }

  async exportUsers(user: User) {
    this.checkAdminAccess(user)

    const users = await this.prisma.user.findMany({
      include: {
        driverProfile: true,
      },
    })

    // Convert to CSV format
    const csvHeaders = [
      'ID',
      'Nom',
      'Email',
      'Téléphone',
      'Locale',
      'Rôles',
      'Statut KYC',
      'Date de création',
    ]

    const csvRows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone || '',
      user.locale,
      user.roles.join(','),
      user.driverProfile?.kycStatus || 'N/A',
      user.createdAt.toISOString(),
    ])

    return {
      headers: csvHeaders,
      rows: csvRows,
    }
  }

  async exportTrips(user: User) {
    this.checkAdminAccess(user)

    const trips = await this.prisma.trip.findMany({
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        place: true,
        itinerary: true,
      },
    })

    const csvHeaders = [
      'ID',
      'Conducteur',
      'Véhicule',
      'Origine',
      'Destination',
      'Date/Heure',
      'Places',
      'Prix par place',
      'Statut',
      'Lieu touristique',
      'Itinéraire',
      'Date de création',
    ]

    const csvRows = trips.map(trip => [
      trip.id,
      trip.driver.user.name,
      `${trip.vehicle.make} ${trip.vehicle.model}`,
      trip.origin['label'],
      trip.destination['label'],
      trip.dateTime.toISOString(),
      trip.seats,
      trip.pricePerSeat,
      trip.status,
      trip.place?.name || '',
      trip.itinerary?.title || '',
      trip.createdAt.toISOString(),
    ])

    return {
      headers: csvHeaders,
      rows: csvRows,
    }
  }
}