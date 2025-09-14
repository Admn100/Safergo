import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ItinerariesService {
  private readonly logger = new Logger(ItinerariesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.itinerary.findMany({
      where: { isActive: true },
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { trips: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            place: true,
          },
          orderBy: { order: 'asc' },
        },
        trips: {
          where: {
            status: 'open',
            departureDateTime: { gte: new Date() },
          },
          include: {
            driver: {
              include: {
                user: {
                  select: { id: true, name: true, photo: true },
                },
              },
            },
          },
        },
      },
    });
  }
}