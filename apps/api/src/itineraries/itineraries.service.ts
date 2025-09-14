import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItineraryDto } from './dto/create-itinerary.dto'
import { UpdateItineraryDto } from './dto/update-itinerary.dto'
import { SearchItinerariesDto } from './dto/search-itineraries.dto'

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async create(createItineraryDto: CreateItineraryDto) {
    const { stops, ...itineraryData } = createItineraryDto

    return this.prisma.itinerary.create({
      data: {
        ...itineraryData,
        stops: {
          create: stops,
        },
      },
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
    })
  }

  async findAll() {
    return this.prisma.itinerary.findMany({
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: {
            order: 'asc',
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

  async search(searchItinerariesDto: SearchItinerariesDto) {
    const { seasonality, tag, difficulty } = searchItinerariesDto

    let where: any = {}

    if (seasonality) {
      where.seasonality = seasonality
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    return this.prisma.itinerary.findMany({
      where,
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: {
            order: 'asc',
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

  async findOne(id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        trips: {
          include: {
            driver: {
              include: {
                user: true,
              },
            },
            vehicle: true,
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
    })

    if (!itinerary) {
      throw new NotFoundException('Itinéraire non trouvé')
    }

    return itinerary
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    const itinerary = await this.findOne(id)

    const { stops, ...itineraryData } = updateItineraryDto

    // If stops are provided, update them
    if (stops) {
      // Delete existing stops
      await this.prisma.itineraryStop.deleteMany({
        where: { itineraryId: id },
      })

      // Create new stops
      await this.prisma.itineraryStop.createMany({
        data: stops.map(stop => ({
          ...stop,
          itineraryId: id,
        })),
      })
    }

    return this.prisma.itinerary.update({
      where: { id },
      data: itineraryData,
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    const itinerary = await this.findOne(id)
    
    await this.prisma.itinerary.delete({
      where: { id },
    })
  }
}