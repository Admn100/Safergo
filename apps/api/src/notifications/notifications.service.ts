import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: createNotificationDto.userId,
        channel: 'PUSH',
        template: createNotificationDto.title,
        payload: { body: createNotificationDto.body, type: createNotificationDto.type },
      },
    });
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: { id },
      data: {
        template: updateNotificationDto.title,
        payload: { body: updateNotificationDto.body, type: updateNotificationDto.type },
        status: updateNotificationDto.read ? 'SENT' : 'PENDING',
      },
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}