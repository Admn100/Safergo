import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PlaceType, Wilaya } from '@prisma/client';
import { calculateDistance } from '@safargo/shared';

interface PlaceFilters {
  type?: PlaceType;
  wilaya?: Wilaya;
  q?: string;
  near?: { lat: number; lng: number; radiusKm?: number };
  sort?: 'rating' | 'popularity' | 'distance' | 'name';
  page?: number;
  limit?: number;
}

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(filters: PlaceFilters = {}) {
    const {
      type,
      wilaya,
      q,
      near,
      sort = 'rating',
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (type) {
      where.type = type;
    }

    if (wilaya) {
      where.wilaya = wilaya;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: [q.toLowerCase()] } },
      ];
    }

    // Get places
    let places = await this.prisma.place.findMany({
      where,
      include: {
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, photo: true },
            },
          },
        },
        _count: {
          select: { reviews: true, trips: true },
        },
      },
      skip,
      take: limit,
    });

    // Apply distance filtering and sorting
    if (near) {
      const { lat, lng, radiusKm = 50 } = near;
      
      places = places
        .map(place => ({
          ...place,
          distance: calculateDistance(
            { lat, lng },
            { lat: place.lat, lng: place.lng }
          ),
        }))
        .filter(place => place.distance <= radiusKm);

      if (sort === 'distance') {
        places.sort((a, b) => a.distance - b.distance);
      }
    }

    // Apply other sorting
    if (sort === 'rating') {
      places.sort((a, b) => b.ratingAgg - a.ratingAgg);
    } else if (sort === 'popularity') {
      places.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === 'name') {
      places.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get total count for pagination
    const total = await this.prisma.place.count({ where });

    return {
      places,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const place = await this.prisma.place.findUnique({
      where: { id },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, photo: true },
            },
          },
        },
        trips: {
          where: {
            status: 'open',
            departureDateTime: { gte: new Date() },
          },
          take: 5,
          include: {
            driver: {
              include: {
                user: {
                  select: { id: true, name: true, photo: true },
                },
                vehicles: true,
              },
            },
          },
        },
        _count: {
          select: { reviews: true, trips: true },
        },
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    return place;
  }

  async findBySlug(slug: string) {
    const place = await this.prisma.place.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, name: true, photo: true },
            },
          },
        },
        trips: {
          where: {
            status: 'open',
            departureDateTime: { gte: new Date() },
          },
          take: 5,
          include: {
            driver: {
              include: {
                user: {
                  select: { id: true, name: true, photo: true },
                },
                vehicles: true,
              },
            },
          },
        },
        _count: {
          select: { reviews: true, trips: true },
        },
      },
    });

    if (!place) {
      throw new NotFoundException('Place not found');
    }

    return place;
  }

  async createReview(placeId: string, userId: string, data: any) {
    // Check if user already reviewed this place
    const existingReview = await this.prisma.placeReview.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const review = await this.prisma.placeReview.update({
        where: { id: existingReview.id },
        data: {
          rating: data.rating,
          text: data.text,
          photos: data.photos || [],
          moderated: false, // Reset moderation status
        },
        include: {
          user: {
            select: { id: true, name: true, photo: true },
          },
        },
      });

      await this.updatePlaceRating(placeId);
      return review;
    }

    // Create new review
    const review = await this.prisma.placeReview.create({
      data: {
        userId,
        placeId,
        rating: data.rating,
        text: data.text,
        photos: data.photos || [],
      },
      include: {
        user: {
          select: { id: true, name: true, photo: true },
        },
      },
    });

    await this.updatePlaceRating(placeId);
    return review;
  }

  async getReviews(placeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const reviews = await this.prisma.placeReview.findMany({
      where: { placeId, moderated: true },
      include: {
        user: {
          select: { id: true, name: true, photo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await this.prisma.placeReview.count({
      where: { placeId, moderated: true },
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPlacesByType(type: PlaceType) {
    return this.prisma.place.findMany({
      where: { type, isActive: true },
      orderBy: { ratingAgg: 'desc' },
      take: 20,
    });
  }

  async getPlacesByWilaya(wilaya: Wilaya) {
    return this.prisma.place.findMany({
      where: { wilaya, isActive: true },
      orderBy: { ratingAgg: 'desc' },
      take: 20,
    });
  }

  async getPopularPlaces(limit = 10) {
    return this.prisma.place.findMany({
      where: { isActive: true },
      orderBy: { reviewCount: 'desc' },
      take: limit,
    });
  }

  async getRecentlyAdded(limit = 10) {
    return this.prisma.place.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private async updatePlaceRating(placeId: string) {
    const reviews = await this.prisma.placeReview.findMany({
      where: { placeId, moderated: true },
      select: { rating: true },
    });

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await this.prisma.place.update({
        where: { id: placeId },
        data: {
          ratingAgg: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        },
      });
    }
  }
}