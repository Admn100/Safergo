import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Prisma, TripStatus } from '@prisma/client'
import { CreateTripDto, SearchTripsDto, parseCoordinates, calculateDistance, getBoundingBox } from '@safargo/shared'
import { PlacesService } from '../places/places.service'
import { ItinerariesService } from '../places/itineraries.service'

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private placesService: PlacesService,
    private itinerariesService: ItinerariesService,
  ) {}

  async createTrip(driverId: string, dto: CreateTripDto) {
    // Verify driver has a vehicle
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: { vehicles: { where: { active: true } } },
    })

    if (!driver || driver.vehicles.length === 0) {
      throw new ForbiddenException('Vous devez avoir un véhicule actif pour créer un trajet')
    }

    // If tourism mode, validate place or itinerary
    let tripData: any = {
      driverId,
      ...dto,
      availableSeats: dto.seats,
      vehicleId: dto.vehicleId || driver.vehicles[0].id,
      status: 'OPEN',
    }

    if (dto.tourismMode && dto.placeId) {
      const place = await this.placesService.getPlace(dto.placeId)
      tripData.destinationLat = place.lat
      tripData.destinationLng = place.lng
      tripData.destinationLabel = place.name
    }

    if (dto.tourismMode && dto.itineraryId) {
      const itinerary = await this.itinerariesService.getItinerary(dto.itineraryId)
      if (itinerary.stops.length > 0) {
        const lastStop = itinerary.stops[itinerary.stops.length - 1]
        tripData.destinationLat = lastStop.place.lat
        tripData.destinationLng = lastStop.place.lng
        tripData.destinationLabel = lastStop.place.name
      }
    }

    const trip = await this.prisma.trip.create({
      data: tripData,
      include: {
        driver: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
        },
        vehicle: true,
        place: true,
        itinerary: {
          include: {
            stops: {
              include: {
                place: {
                  select: {
                    id: true,
                    name: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: driver.userId,
        action: 'trip.create',
        entity: 'Trip',
        entityId: trip.id,
        meta: { tourismMode: dto.tourismMode },
      },
    })

    return trip
  }

  async searchTrips(dto: SearchTripsDto) {
    const { near, radiusKm, date, seats, priceMax, tourismMode, sort, page, limit } = dto
    const offset = (page - 1) * limit

    let where: Prisma.TripWhereInput = {
      status: 'OPEN',
      dateTime: date ? { gte: new Date(date) } : { gte: new Date() },
      availableSeats: seats ? { gte: seats } : { gte: 1 },
      ...(priceMax && { pricePerSeat: { lte: priceMax } }),
      ...(tourismMode !== undefined && { tourismMode }),
    }

    // Handle location-based search
    if (near) {
      const coords = parseCoordinates(near)
      if (coords) {
        const [minLat, minLng, maxLat, maxLng] = getBoundingBox(coords.lat, coords.lng, radiusKm * 1000)
        
        where = {
          ...where,
          OR: [
            {
              originLat: { gte: minLat, lte: maxLat },
              originLng: { gte: minLng, lte: maxLng },
            },
            {
              destinationLat: { gte: minLat, lte: maxLat },
              destinationLng: { gte: minLng, lte: maxLng },
            },
          ],
        }
      }
    }

    // Query trips
    const [trips, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        include: {
          driver: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  photo: true,
                },
              },
            },
          },
          vehicle: {
            select: {
              make: true,
              model: true,
              color: true,
            },
          },
          place: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
        skip: offset,
        take: limit,
        orderBy: this.getOrderBy(sort),
      }),
      this.prisma.trip.count({ where }),
    ])

    // Calculate distances if coordinates provided
    let processedTrips = trips
    if (near) {
      const coords = parseCoordinates(near)
      if (coords) {
        processedTrips = trips.map((trip) => ({
          ...trip,
          originDistance: calculateDistance(coords.lat, coords.lng, trip.originLat, trip.originLng),
          destinationDistance: calculateDistance(coords.lat, coords.lng, trip.destinationLat, trip.destinationLng),
        }))

        if (sort === 'distance') {
          processedTrips.sort((a: any, b: any) => 
            Math.min(a.originDistance, a.destinationDistance) - Math.min(b.originDistance, b.destinationDistance)
          )
        }
      }
    }

    return {
      data: processedTrips.map((trip: any) => ({
        id: trip.id,
        origin: {
          lat: trip.originLat,
          lng: trip.originLng,
          label: trip.originLabel,
          ...(trip.originDistance && { distance: trip.originDistance }),
        },
        destination: {
          lat: trip.destinationLat,
          lng: trip.destinationLng,
          label: trip.destinationLabel,
          ...(trip.destinationDistance && { distance: trip.destinationDistance }),
        },
        dateTime: trip.dateTime,
        seats: trip.seats,
        availableSeats: trip.availableSeats,
        pricePerSeat: trip.pricePerSeat,
        currency: trip.currency,
        rules: trip.rules,
        tourismMode: trip.tourismMode,
        driver: trip.driver,
        vehicle: trip.vehicle,
        place: trip.place,
        bookingsCount: trip._count.bookings,
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getTrip(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'FINISHED'] } },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
        },
        place: true,
        itinerary: {
          include: {
            stops: {
              orderBy: { order: 'asc' },
              include: {
                place: true,
              },
            },
          },
        },
      },
    })

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé')
    }

    return trip
  }

  async updateTripStatus(tripId: string, driverId: string, status: TripStatus) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé')
    }

    if (trip.driverId !== driverId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce trajet')
    }

    const updatedTrip = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status },
    })

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: driverId,
        action: `trip.status.${status.toLowerCase()}`,
        entity: 'Trip',
        entityId: tripId,
        meta: { previousStatus: trip.status },
      },
    })

    return updatedTrip
  }

  private getOrderBy(sort: string): Prisma.TripOrderByWithRelationInput {
    switch (sort) {
      case 'price':
        return { pricePerSeat: 'asc' }
      case 'date':
        return { dateTime: 'asc' }
      default:
        return { createdAt: 'desc' }
    }
  }
}