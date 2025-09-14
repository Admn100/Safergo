import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, tripId: string, data: any) {
    // Implementation for booking creation
    return { message: 'Booking created successfully' };
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            driver: {
              include: {
                user: {
                  select: { id: true, name: true, photo: true },
                },
              },
            },
            place: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}