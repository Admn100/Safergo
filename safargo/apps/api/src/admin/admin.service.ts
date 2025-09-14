import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, trips, bookings, places] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.trip.count(),
      this.prisma.booking.count(),
      this.prisma.place.count(),
    ]);

    return { users, trips, bookings, places };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        driver: true,
        _count: {
          select: { trips: true, bookings: true },
        },
      },
    });

    const total = await this.prisma.user.count();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}