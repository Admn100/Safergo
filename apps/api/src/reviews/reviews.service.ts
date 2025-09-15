import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
        text: createReviewDto.comment,
        fromUserId: createReviewDto.fromUserId,
        toUserId: createReviewDto.toUserId,
        tripId: createReviewDto.bookingId,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        fromUser: true,
        toUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}