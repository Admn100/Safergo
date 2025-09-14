import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'
import { SearchPlacesDto } from './dto/search-places.dto'
import { Place, PlaceType } from '@prisma/client'

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.prisma.place.create({
      data: createPlaceDto,
    })
  }

  async findAll(): Promise<Place[]> {
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
        ratingAgg: 'desc',
      },
    })
  }

  async search(searchPlacesDto: SearchPlacesDto): Promise<Place[]> {
    const {
      type,
      wilaya,
      q,
      near,
      radiusKm = 50,
      sort = 'rating',
    } = searchPlacesDto

    let where: any = {}

    // Filter by type
    if (type) {
      where.type = type
    }

    // Filter by wilaya
    if (wilaya) {
      where.wilaya = {
        contains: wilaya,
        mode: 'insensitive',
      }
    }

    // Text search
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ]
    }

    // Geographic search
    if (near) {
      const [lat, lng] = near.split(',').map(Number)
      if (isNaN(lat) || isNaN(lng)) {
        throw new BadRequestException('Coordonnées invalides')
      }

      // For demo purposes, we'll do a simple bounding box search
      // In production, use PostGIS for proper geographic queries
      const latRange = radiusKm / 111 // Rough conversion: 1 degree ≈ 111 km
      const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180))

      where.coords = {
        path: ['lat'],
        gte: lat - latRange,
        lte: lat + latRange,
      }
    }

    const orderBy: any = {}
    switch (sort) {
      case 'rating':
        orderBy.ratingAgg = 'desc'
        break
      case 'popularity':
        orderBy.reviewCount = 'desc'
        break
      case 'name':
        orderBy.name = 'asc'
        break
      default:
        orderBy.ratingAgg = 'desc'
    }

    return this.prisma.place.findMany({
      where,
      include: {
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
      orderBy,
    })
  }

  async findOne(id: string): Promise<Place> {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
    })

    if (!place) {
      throw new NotFoundException('Lieu non trouvé')
    }

    return place
  }

  async findBySlug(slug: string): Promise<Place> {
    const place = await this.prisma.place.findUnique({
      where: { slug },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
    })

    if (!place) {
      throw new NotFoundException('Lieu non trouvé')
    }

    return place
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    const place = await this.findOne(id)

    return this.prisma.place.update({
      where: { id },
      data: updatePlaceDto,
    })
  }

  async remove(id: string): Promise<void> {
    const place = await this.findOne(id)
    
    await this.prisma.place.delete({
      where: { id },
    })
  }

  async getByType(type: PlaceType): Promise<Place[]> {
    return this.prisma.place.findMany({
      where: { type },
      include: {
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
      orderBy: {
        ratingAgg: 'desc',
      },
    })
  }

  async getByWilaya(wilaya: string): Promise<Place[]> {
    return this.prisma.place.findMany({
      where: {
        wilaya: {
          contains: wilaya,
          mode: 'insensitive',
        },
      },
      include: {
        _count: {
          select: {
            reviews: true,
            trips: true,
          },
        },
      },
      orderBy: {
        ratingAgg: 'desc',
      },
    })
  }
}