import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { User } from '@prisma/client';

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async create(createTripDto: CreateTripDto, driverId: string): Promise<any> {
    return this.prisma.trip.create({
      data: {
        ...createTripDto,
        driverId,
        origin: JSON.parse(createTripDto.origin),
        destination: JSON.parse(createTripDto.destination),
      },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        bookings: true,
      },
    });
  }

  async findAll(searchTripsDto: SearchTripsDto) {
    const { origin, destination, date, seats, maxPrice, sort } = searchTripsDto;

    const where: any = {
      status: 'OPEN',
    };

    if (origin) {
      where.origin = {
        path: ['label'],
        string_contains: origin,
      };
    }

    if (destination) {
      where.destination = {
        path: ['label'],
        string_contains: destination,
      };
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      
      where.dateTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (seats) {
      where.seats = {
        gte: seats,
      };
    }

    if (maxPrice) {
      where.pricePerSeat = {
        lte: maxPrice,
      };
    }

    const orderBy = sort === 'price' 
      ? { pricePerSeat: 'asc' as const }
      : { dateTime: 'asc' as const };

    return this.prisma.trip.findMany({
      where,
      orderBy,
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        bookings: true,
        place: true,
        itinerary: true,
      },
    });
  }

  async findOne(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: true,
          },
        },
        vehicle: true,
        bookings: {
          include: {
            user: true,
          },
        },
        place: true,
        itinerary: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé');
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto, user: User): Promise<any> {
    const trip = await this.findOne(id);

    if (trip.driverId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce trajet');
    }

    return this.prisma.trip.update({
      where: { id },
      data: {
        ...updateTripDto,
        origin: updateTripDto.origin ? JSON.parse(updateTripDto.origin) : undefined,
        destination: updateTripDto.destination ? JSON.parse(updateTripDto.destination) : undefined,
      },
    });
  }

  async remove(id: string, user: User): Promise<void> {
    const trip = await this.findOne(id);

    if (trip.driverId !== user.id) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce trajet');
    }

    await this.prisma.trip.delete({
      where: { id },
    });
  }
}