import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTripDto } from './dto/create-trip.dto'
import { UpdateTripDto } from './dto/update-trip.dto'
import { SearchTripsDto } from './dto/search-trips.dto'
import { Trip, TripStatus, User } from '@prisma/client'

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(createTripDto: CreateTripDto, driverId: string): Promise<Trip> {
    // Verify driver has a vehicle
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { driverId },
    })

    if (!vehicle) {
      throw new BadRequestException('Aucun véhicule trouvé pour ce conducteur')
    }

    return this.prisma.trip.create({
      data: {
        ...createTripDto,
        driverId,
        vehicleId: vehicle.id,
      },
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
    })
  }

  async findAll(): Promise<Trip[]> {
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
        dateTime: 'asc',
      },
    })
  }

  async search(searchTripsDto: SearchTripsDto): Promise<Trip[]> {
    const {
      origin,
      destination,
      date,
      seats,
      maxPrice,
      sort = 'date',
    } = searchTripsDto

    let where: any = {
      status: TripStatus.OPEN,
    }

    // Date filter
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      
      where.dateTime = {
        gte: startDate,
        lt: endDate,
      }
    }

    // Seats filter
    if (seats) {
      where.seats = {
        gte: seats,
      }
    }

    // Price filter
    if (maxPrice) {
      where.pricePerSeat = {
        lte: maxPrice,
      }
    }

    // Origin filter (simplified - in production, use geographic search)
    if (origin) {
      where.origin = {
        path: ['label'],
        string_contains: origin,
      }
    }

    // Destination filter (simplified - in production, use geographic search)
    if (destination) {
      where.destination = {
        path: ['label'],
        string_contains: destination,
      }
    }

    const orderBy: any = {}
    switch (sort) {
      case 'date':
        orderBy.dateTime = 'asc'
        break
      case 'price':
        orderBy.pricePerSeat = 'asc'
        break
      case 'seats':
        orderBy.seats = 'desc'
        break
      default:
        orderBy.dateTime = 'asc'
    }

    return this.prisma.trip.findMany({
      where,
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
      orderBy,
    })
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        place: true,
        itinerary: true,
        bookings: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    })

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé')
    }

    return trip
  }

  async update(id: string, updateTripDto: UpdateTripDto, user: User): Promise<Trip> {
    const trip = await this.findOne(id)

    // Check if user is the driver or admin
    if (trip.driverId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce trajet')
    }

    return this.prisma.trip.update({
      where: { id },
      data: updateTripDto,
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
    })
  }

  async remove(id: string, user: User): Promise<void> {
    const trip = await this.findOne(id)

    // Check if user is the driver or admin
    if (trip.driverId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce trajet')
    }

    await this.prisma.trip.delete({
      where: { id },
    })
  }

  async updateStatus(id: string, status: TripStatus, user: User): Promise<Trip> {
    const trip = await this.findOne(id)

    // Check if user is the driver or admin
    if (trip.driverId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Vous ne pouvez pas modifier le statut de ce trajet')
    }

    return this.prisma.trip.update({
      where: { id },
      data: { status },
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
    })
  }

  async getByDriver(driverId: string): Promise<Trip[]> {
    return this.prisma.trip.findMany({
      where: { driverId },
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
        dateTime: 'desc',
      },
    })
  }

  async getTourismTrips(): Promise<Trip[]> {
    return this.prisma.trip.findMany({
      where: {
        OR: [
          { placeId: { not: null } },
          { itineraryId: { not: null } },
        ],
        status: TripStatus.OPEN,
      },
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
        dateTime: 'asc',
      },
    })
  }
}