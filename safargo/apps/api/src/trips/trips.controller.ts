import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search trips' })
  async findAll(@Query() filters: any) {
    return this.tripsService.findAll(filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  async findById(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new trip' })
  async create(@CurrentUser() user: any, @Body() tripData: any) {
    return this.tripsService.create(user.id, tripData);
  }
}