import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PlacesService } from './places.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SearchPlacesDto, CreatePlaceReviewDto, searchPlacesSchema, createPlaceReviewSchema } from '@safargo/shared'
import { ZodValidationPipe } from 'nestjs-zod'

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher des lieux touristiques' })
  @ApiResponse({ status: 200, description: 'Liste des lieux' })
  async searchPlaces(
    @Query(new ZodValidationPipe(searchPlacesSchema)) query: SearchPlacesDto,
  ) {
    return this.placesService.searchPlaces(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un lieu par ID' })
  @ApiResponse({ status: 200, description: 'Détails du lieu' })
  @ApiResponse({ status: 404, description: 'Lieu non trouvé' })
  async getPlace(@Param('id') id: string) {
    return this.placesService.getPlace(id)
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtenir un lieu par slug' })
  @ApiResponse({ status: 200, description: 'Détails du lieu' })
  @ApiResponse({ status: 404, description: 'Lieu non trouvé' })
  async getPlaceBySlug(@Param('slug') slug: string) {
    return this.placesService.getPlaceBySlug(slug)
  }

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un avis sur un lieu' })
  @ApiResponse({ status: 201, description: 'Avis créé' })
  @ApiResponse({ status: 404, description: 'Lieu non trouvé' })
  async createPlaceReview(
    @Param('id') placeId: string,
    @Request() req,
    @Body(new ZodValidationPipe(createPlaceReviewSchema)) dto: CreatePlaceReviewDto,
  ) {
    return this.placesService.createPlaceReview(placeId, req.user.id, dto)
  }
}