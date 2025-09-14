import { 
  Controller, 
  Get, 
  UseGuards 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '@prisma/client'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le tableau de bord administrateur' })
  @ApiResponse({ status: 200, description: 'Données du tableau de bord' })
  async getDashboard(@CurrentUser() user: User) {
    return this.adminService.getDashboard(user)
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir tous les utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs' })
  async getUsers(@CurrentUser() user: User) {
    return this.adminService.getUsers(user)
  }

  @Get('trips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir tous les trajets' })
  @ApiResponse({ status: 200, description: 'Liste des trajets' })
  async getTrips(@CurrentUser() user: User) {
    return this.adminService.getTrips(user)
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir toutes les réservations' })
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  async getBookings(@CurrentUser() user: User) {
    return this.adminService.getBookings(user)
  }

  @Get('disputes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir tous les litiges' })
  @ApiResponse({ status: 200, description: 'Liste des litiges' })
  async getDisputes(@CurrentUser() user: User) {
    return this.adminService.getDisputes(user)
  }

  @Get('places')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir tous les lieux touristiques' })
  @ApiResponse({ status: 200, description: 'Liste des lieux' })
  async getPlaces(@CurrentUser() user: User) {
    return this.adminService.getPlaces(user)
  }

  @Get('itineraries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir tous les itinéraires' })
  @ApiResponse({ status: 200, description: 'Liste des itinéraires' })
  async getItineraries(@CurrentUser() user: User) {
    return this.adminService.getItineraries(user)
  }

  @Get('export/users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exporter les utilisateurs en CSV' })
  @ApiResponse({ status: 200, description: 'Données CSV des utilisateurs' })
  async exportUsers(@CurrentUser() user: User) {
    return this.adminService.exportUsers(user)
  }

  @Get('export/trips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exporter les trajets en CSV' })
  @ApiResponse({ status: 200, description: 'Données CSV des trajets' })
  async exportTrips(@CurrentUser() user: User) {
    return this.adminService.exportTrips(user)
  }
}