import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    if (createUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      })
      if (existingUser) {
        throw new BadRequestException('Un utilisateur avec cet email existe déjà')
      }
    }

    if (createUserDto.phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone: createUserDto.phone },
      })
      if (existingUser) {
        throw new BadRequestException('Un utilisateur avec ce téléphone existe déjà')
      }
    }

    return this.prisma.user.create({
      data: createUserDto as any,
    })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        driverProfile: true,
        _count: {
          select: {
            bookings: true,
            reviewsGiven: true,
          },
        },
      },
    })
  }

  async findOne(id: string): Promise<User> {
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
        reviews: true,
        _count: {
          select: {
            bookings: true,
            reviewsGiven: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé')
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    })
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    
    await this.prisma.user.delete({
      where: { id },
    })
  }

  async getProfile(userId: string): Promise<User> {
    return this.findOne(userId)
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.update(userId, updateUserDto)
  }
}