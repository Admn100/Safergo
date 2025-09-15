import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto) {
    return this.prisma.driver.create({
      data: createDriverDto,
    });
  }

  async findAll() {
    return this.prisma.driver.findMany({
      include: {
        user: true,
        vehicles: true,
        trips: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.driver.findUnique({
      where: { id },
      include: {
        user: true,
        vehicles: true,
        trips: {
          include: {
            bookings: true,
          },
        },
      },
    });
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    return this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  async remove(id: string) {
    return this.prisma.driver.delete({
      where: { id },
    });
  }
}