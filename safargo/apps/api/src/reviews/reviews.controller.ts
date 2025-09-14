import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user reviews' })
  async getByUser(@Param('userId') userId: string) {
    return this.reviewsService.getByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create review' })
  async create(@CurrentUser() user: any, @Body() reviewData: any) {
    return this.reviewsService.create(
      user.id,
      reviewData.toUserId,
      reviewData.tripId,
      reviewData,
    );
  }
}