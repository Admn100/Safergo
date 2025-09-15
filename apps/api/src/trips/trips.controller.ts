import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTripDto: CreateTripDto, @Request() req) {
    return this.tripsService.create(createTripDto, req.user.userId);
  }

  @Get()
  findAll(@Query() searchTripsDto: SearchTripsDto) {
    return this.tripsService.findAll(searchTripsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto, @Request() req) {
    return this.tripsService.update(id, updateTripDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.tripsService.remove(id, req.user);
  }
}