import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { UpdateProfileDto } from '@safargo/shared'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        driver: true,
        _count: {
          select: {
            bookings: true,
            reviewsGiven: true,
            reviewsReceived: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé')
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      photo: user.photo,
      locale: user.locale,
      roles: user.roles,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
      driver: user.driver,
      stats: {
        bookingsCount: user._count.bookings,
        reviewsGivenCount: user._count.reviewsGiven,
        reviewsReceivedCount: user._count.reviewsReceived,
      },
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    })

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'user.update_profile',
        entity: 'User',
        entityId: userId,
        meta: { fields: Object.keys(dto) },
      },
    })

    return user
  }

  async becomeDriver(userId: string, licenseNumber: string) {
    // Check if already driver
    const existingDriver = await this.prisma.driver.findUnique({
      where: { userId },
    })

    if (existingDriver) {
      return existingDriver
    }

    // Create driver profile
    const driver = await this.prisma.driver.create({
      data: {
        userId,
        licenseNumber,
      },
    })

    // Update user roles
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          push: 'DRIVER',
        },
      },
    })

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'driver.create',
        entity: 'Driver',
        entityId: driver.id,
      },
    })

    return driver
  }

  async getUserReviews(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { toUserId: userId, moderated: true },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
          trip: {
            select: {
              id: true,
              originLabel: true,
              destinationLabel: true,
              dateTime: true,
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({
        where: { toUserId: userId, moderated: true },
      }),
    ])

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }
}