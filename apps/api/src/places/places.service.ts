import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { SearchPlacesDto } from './dto/search-places.dto';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  async create(createPlaceDto: CreatePlaceDto) {
    return this.prisma.place.create({
      data: {
        ...createPlaceDto,
        coords: {
          lat: createPlaceDto.lat,
          lng: createPlaceDto.lng,
        },
      },
    });
  }

  async findAll(searchPlacesDto: SearchPlacesDto) {
    const { type, wilaya, q, lat, lng, radiusKm, sort } = searchPlacesDto;

    const where: any = {};

    if (type) where.type = type;
    if (wilaya) where.wilaya = wilaya;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { wilaya: { contains: q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.place.findMany({
      where,
      orderBy: sort === 'name' ? { name: 'asc' } : { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.place.findUnique({
      where: { id },
      include: {
        reviews: true,
        trips: true,
      },
    });
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: { id },
      data: updatePlaceDto,
    });
  }

  async remove(id: string) {
    return this.prisma.place.delete({
      where: { id },
    });
  }
}