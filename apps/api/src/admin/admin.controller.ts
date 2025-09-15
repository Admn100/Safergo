import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers(@Request() req) {
    return this.adminService.getUsers(req.user);
  }

  @Get('trips')
  getTrips(@Request() req) {
    return this.adminService.getTrips(req.user);
  }

  @Get('bookings')
  getBookings(@Request() req) {
    return this.adminService.getBookings(req.user);
  }

  @Get('places')
  getPlaces(@Request() req) {
    return this.adminService.getPlaces(req.user);
  }

  @Get('itineraries')
  getItineraries(@Request() req) {
    return this.adminService.getItineraries(req.user);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.adminService.getStats(req.user);
  }
}