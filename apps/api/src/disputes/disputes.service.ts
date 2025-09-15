import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(private prisma: PrismaService) {}

  async create(createDisputeDto: CreateDisputeDto) {
    return this.prisma.dispute.create({
      data: createDisputeDto,
    });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      include: {
        booking: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: true,
      },
    });
  }

  async update(id: string, updateDisputeDto: UpdateDisputeDto) {
    return this.prisma.dispute.update({
      where: { id },
      data: updateDisputeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.dispute.delete({
      where: { id },
    });
  }
}