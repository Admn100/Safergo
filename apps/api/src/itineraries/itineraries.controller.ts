import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { SearchItinerariesDto } from './dto/search-itineraries.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itinerariesService.create(createItineraryDto);
  }

  @Get()
  findAll(@Query() searchItinerariesDto: SearchItinerariesDto) {
    return this.itinerariesService.findAll(searchItinerariesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itinerariesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateItineraryDto: UpdateItineraryDto) {
    return this.itinerariesService.update(id, updateItineraryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.itinerariesService.remove(id);
  }
}