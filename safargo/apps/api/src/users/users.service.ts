import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userPreferences: true,
        driver: {
          include: {
            vehicles: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(id: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        photo: data.photo,
        locale: data.locale,
      },
      include: {
        userPreferences: true,
      },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async updatePreferences(id: string, preferences: any) {
    await this.prisma.userPreferences.upsert({
      where: { userId: id },
      update: preferences,
      create: {
        userId: id,
        ...preferences,
      },
    });

    return this.findById(id);
  }
}