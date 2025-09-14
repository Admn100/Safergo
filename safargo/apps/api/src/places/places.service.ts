import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Prisma } from '@prisma/client'
import { SearchPlacesDto, CreatePlaceReviewDto, parseCoordinates, calculateDistance } from '@safargo/shared'

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async searchPlaces(dto: SearchPlacesDto) {
    const { type, wilaya, q, near, radiusKm, sort, page, limit } = dto
    const offset = (page - 1) * limit

    const where: Prisma.PlaceWhereInput = {
      active: true,
      ...(type && { type: type as any }),
      ...(wilaya && { wilaya }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      }),
    }

    let places = await this.prisma.place.findMany({
      where,
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    })

    // Filter by distance if coordinates provided
    if (near) {
      const coords = parseCoordinates(near)
      if (coords) {
        places = places.filter((place) => {
          const distance = calculateDistance(coords.lat, coords.lng, place.lat, place.lng)
          return distance <= radiusKm * 1000
        })

        // Add distance to places
        places = places.map((place) => ({
          ...place,
          distance: calculateDistance(coords.lat, coords.lng, place.lat, place.lng),
        }))
      }
    }

    // Sort
    switch (sort) {
      case 'rating':
        places.sort((a, b) => b.ratingAgg - a.ratingAgg)
        break
      case 'popularity':
        places.sort((a, b) => b._count.reviews - a._count.reviews)
        break
      case 'distance':
        if ('distance' in places[0]) {
          places.sort((a: any, b: any) => a.distance - b.distance)
        }
        break
    }

    // Paginate
    const total = places.length
    places = places.slice(offset, offset + limit)

    return {
      data: places.map((place) => ({
        id: place.id,
        name: place.name,
        slug: place.slug,
        type: place.type,
        wilaya: place.wilaya,
        coordinates: { lat: place.lat, lng: place.lng },
        coverUrl: place.coverUrl,
        gallery: place.gallery,
        description: place.description,
        openHours: place.openHours,
        priceHint: place.priceHint,
        tags: place.tags,
        rating: place.ratingAgg,
        reviewCount: place._count.reviews,
        safetyNotes: place.safetyNotes,
        featured: place.featured,
        ...('distance' in place && { distance: (place as any).distance }),
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async getPlace(id: string) {
    const place = await this.prisma.place.findUnique({
      where: { id, active: true },
      include: {
        reviews: {
          where: { moderated: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
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
        _count: {
          select: { reviews: true },
        },
      },
    })

    if (!place) {
      throw new NotFoundException('Lieu non trouvé')
    }

    return {
      ...place,
      coordinates: { lat: place.lat, lng: place.lng },
      reviewCount: place._count.reviews,
    }
  }

  async getPlaceBySlug(slug: string) {
    const place = await this.prisma.place.findUnique({
      where: { slug, active: true },
      include: {
        reviews: {
          where: { moderated: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
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
        _count: {
          select: { reviews: true },
        },
      },
    })

    if (!place) {
      throw new NotFoundException('Lieu non trouvé')
    }

    return {
      ...place,
      coordinates: { lat: place.lat, lng: place.lng },
      reviewCount: place._count.reviews,
    }
  }

  async createPlaceReview(placeId: string, userId: string, dto: CreatePlaceReviewDto) {
    // Check if place exists
    const place = await this.prisma.place.findUnique({
      where: { id: placeId, active: true },
    })

    if (!place) {
      throw new NotFoundException('Lieu non trouvé')
    }

    // Check if user already reviewed this place
    const existingReview = await this.prisma.placeReview.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    })

    if (existingReview) {
      throw new Error('Vous avez déjà évalué ce lieu')
    }

    // Create review
    const review = await this.prisma.placeReview.create({
      data: {
        placeId,
        userId,
        ...dto,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    })

    // Update place rating
    await this.updatePlaceRating(placeId)

    return review
  }

  private async updatePlaceRating(placeId: string) {
    const reviews = await this.prisma.placeReview.findMany({
      where: { placeId, moderated: true },
      select: { rating: true },
    })

    if (reviews.length === 0) return

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await this.prisma.place.update({
      where: { id: placeId },
      data: {
        ratingAgg: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    })
  }
}