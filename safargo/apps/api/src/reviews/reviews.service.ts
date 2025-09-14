import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private prisma: PrismaService) {}

  async create(fromUserId: string, toUserId: string, tripId: string, data: any) {
    // Implementation for creating reviews
    return { message: 'Review created successfully' };
  }

  async getByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { toUserId: userId, moderated: true },
      include: {
        fromUser: {
          select: { id: true, name: true, photo: true },
        },
        trip: {
          select: { id: true, originLabel: true, destinationLabel: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}