import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { PlaceType, Wilaya } from '@prisma/client';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get places with filters' })
  @ApiQuery({ name: 'type', enum: PlaceType, required: false })
  @ApiQuery({ name: 'wilaya', enum: Wilaya, required: false })
  @ApiQuery({ name: 'q', type: String, required: false, description: 'Search query' })
  @ApiQuery({ name: 'near', type: String, required: false, description: 'lat,lng coordinates' })
  @ApiQuery({ name: 'radiusKm', type: Number, required: false, description: 'Search radius in km' })
  @ApiQuery({ name: 'sort', enum: ['rating', 'popularity', 'distance', 'name'], required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async findAll(
    @Query('type') type?: PlaceType,
    @Query('wilaya') wilaya?: Wilaya,
    @Query('q') q?: string,
    @Query('near') near?: string,
    @Query('radiusKm', new DefaultValuePipe(50), ParseIntPipe) radiusKm?: number,
    @Query('sort') sort?: 'rating' | 'popularity' | 'distance' | 'name',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    const filters: any = {
      type,
      wilaya,
      q,
      sort,
      page,
      limit,
    };

    if (near) {
      const [lat, lng] = near.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        filters.near = { lat, lng, radiusKm };
      }
    }

    return this.placesService.findAll(filters);
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Get popular places' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getPopular(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.placesService.getPopularPlaces(limit);
  }

  @Public()
  @Get('recent')
  @ApiOperation({ summary: 'Get recently added places' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getRecent(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.placesService.getRecentlyAdded(limit);
  }

  @Public()
  @Get('by-type/:type')
  @ApiOperation({ summary: 'Get places by type' })
  async getByType(@Param('type') type: PlaceType) {
    return this.placesService.getPlacesByType(type);
  }

  @Public()
  @Get('by-wilaya/:wilaya')
  @ApiOperation({ summary: 'Get places by wilaya' })
  async getByWilaya(@Param('wilaya') wilaya: Wilaya) {
    return this.placesService.getPlacesByWilaya(wilaya);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get place by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.placesService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get place by ID' })
  async findById(@Param('id') id: string) {
    return this.placesService.findById(id);
  }

  @Public()
  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get place reviews' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getReviews(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.placesService.getReviews(id, page, limit);
  }

  @Post(':id/reviews')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create or update place review' })
  async createReview(
    @Param('id') placeId: string,
    @CurrentUser() user: any,
    @Body() reviewData: any,
  ) {
    return this.placesService.createReview(placeId, user.id, reviewData);
  }
}