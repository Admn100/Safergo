import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateProfileDto, updateProfileSchema } from '@safargo/shared'
import { ZodValidationPipe } from 'nestjs-zod'

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtenir mon profil' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur' })
  async getMyProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id)
  }

  @Patch('me')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour' })
  async updateMyProfile(
    @Request() req,
    @Body(new ZodValidationPipe(updateProfileSchema)) dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.id, dto)
  }

  @Post('become-driver')
  @ApiOperation({ summary: 'Devenir conducteur' })
  @ApiResponse({ status: 201, description: 'Profil conducteur créé' })
  async becomeDriver(
    @Request() req,
    @Body() body: { licenseNumber: string },
  ) {
    return this.usersService.becomeDriver(req.user.id, body.licenseNumber)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un profil public' })
  @ApiResponse({ status: 200, description: 'Profil public' })
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id)
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Obtenir les avis d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des avis' })
  async getUserReviews(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getUserReviews(
      id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )
  }
}