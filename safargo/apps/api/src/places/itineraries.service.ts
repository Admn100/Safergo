import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Prisma } from '@prisma/client'

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async searchItineraries(query: {
    seasonality?: string
    tag?: string
    page?: number
    limit?: number
  }) {
    const { seasonality, tag, page = 1, limit = 20 } = query
    const offset = (page - 1) * limit

    const where: Prisma.ItineraryWhereInput = {
      active: true,
      ...(seasonality && { seasonality: seasonality as any }),
      ...(tag && { tags: { has: tag } }),
    }

    const [itineraries, total] = await Promise.all([
      this.prisma.itinerary.findMany({
        where,
        include: {
          stops: {
            orderBy: { order: 'asc' },
            include: {
              place: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  lat: true,
                  lng: true,
                  coverUrl: true,
                },
              },
            },
          },
          _count: {
            select: { trips: true },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { featured: 'desc' },
      }),
      this.prisma.itinerary.count({ where }),
    ])

    return {
      data: itineraries.map((itinerary) => ({
        id: itinerary.id,
        title: itinerary.title,
        description: itinerary.description,
        coverUrl: itinerary.coverUrl,
        durationHint: itinerary.durationHint,
        distance: itinerary.distance,
        seasonality: itinerary.seasonality,
        difficulty: itinerary.difficulty,
        tags: itinerary.tags,
        featured: itinerary.featured,
        tripCount: itinerary._count.trips,
        stops: itinerary.stops.map((stop) => ({
          order: stop.order,
          dwellMin: stop.dwellMin,
          note: stop.note,
          place: {
            id: stop.place.id,
            name: stop.place.name,
            type: stop.place.type,
            coordinates: { lat: stop.place.lat, lng: stop.place.lng },
            coverUrl: stop.place.coverUrl,
          },
        })),
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getItinerary(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id, active: true },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: {
            place: true,
          },
        },
        _count: {
          select: { trips: true },
        },
      },
    })

    if (!itinerary) {
      throw new NotFoundException('Itinéraire non trouvé')
    }

    return {
      ...itinerary,
      tripCount: itinerary._count.trips,
      stops: itinerary.stops.map((stop) => ({
        order: stop.order,
        dwellMin: stop.dwellMin,
        note: stop.note,
        place: {
          ...stop.place,
          coordinates: { lat: stop.place.lat, lng: stop.place.lng },
        },
      })),
    }
  }
}