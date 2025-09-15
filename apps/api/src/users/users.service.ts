import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto as any,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        driverProfile: true,
        bookings: {
          include: {
            trip: true,
          },
        },
        reviewsGiven: true,
        _count: {
          select: {
            bookings: true,
            reviewsGiven: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        driverProfile: {
          include: {
            vehicles: true,
          },
        },
        bookings: {
          include: {
            trip: true,
          },
        },
        reviewsGiven: true,
        reviewsReceived: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}