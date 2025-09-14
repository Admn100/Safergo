import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user bookings' })
  async findByUser(@CurrentUser() user: any) {
    return this.bookingsService.findByUser(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create booking' })
  async create(@CurrentUser() user: any, @Body() bookingData: any) {
    return this.bookingsService.create(user.id, bookingData.tripId, bookingData);
  }
}