import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceReviewDto } from './dto/create-place-review.dto';
import { UpdatePlaceReviewDto } from './dto/update-place-review.dto';

@Injectable()
export class PlaceReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaceReviewDto: CreatePlaceReviewDto) {
    return this.prisma.placeReview.create({
      data: createPlaceReviewDto,
    });
  }

  async findAll() {
    return this.prisma.placeReview.findMany({
      include: {
        place: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.placeReview.findUnique({
      where: { id },
      include: {
        place: true,
        user: true,
      },
    });
  }

  async update(id: string, updatePlaceReviewDto: UpdatePlaceReviewDto) {
    return this.prisma.placeReview.update({
      where: { id },
      data: updatePlaceReviewDto,
    });
  }

  async remove(id: string) {
    return this.prisma.placeReview.delete({
      where: { id },
    });
  }
}