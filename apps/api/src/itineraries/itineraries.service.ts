import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { SearchItinerariesDto } from './dto/search-itineraries.dto';

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async create(createItineraryDto: CreateItineraryDto) {
    return this.prisma.itinerary.create({
      data: {
        ...createItineraryDto,
        seasonality: createItineraryDto.seasonality as any,
        stops: {
          create: createItineraryDto.stops,
        },
      },
    });
  }

  async findAll(searchItinerariesDto: SearchItinerariesDto) {
    const { seasonality, tag } = searchItinerariesDto;

    const where: any = {};

    if (seasonality) where.seasonality = seasonality;
    if (tag) where.tags = { has: tag };

    return this.prisma.itinerary.findMany({
      where,
      include: {
        stops: {
          include: {
            place: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.itinerary.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            place: true,
          },
        },
      },
    });
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    const { stops, ...itineraryData } = updateItineraryDto;

    return this.prisma.itinerary.update({
      where: { id },
      data: {
        ...itineraryData,
        seasonality: itineraryData.seasonality as any,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.itinerary.delete({
      where: { id },
    });
  }
}