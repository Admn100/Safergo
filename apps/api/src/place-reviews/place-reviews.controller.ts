import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlaceReviewsService } from './place-reviews.service';
import { CreatePlaceReviewDto } from './dto/create-place-review.dto';
import { UpdatePlaceReviewDto } from './dto/update-place-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('place-reviews')
@UseGuards(JwtAuthGuard)
export class PlaceReviewsController {
  constructor(private readonly placeReviewsService: PlaceReviewsService) {}

  @Post()
  create(@Body() createPlaceReviewDto: CreatePlaceReviewDto) {
    return this.placeReviewsService.create(createPlaceReviewDto);
  }

  @Get()
  findAll() {
    return this.placeReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeReviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceReviewDto: UpdatePlaceReviewDto) {
    return this.placeReviewsService.update(id, updatePlaceReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeReviewsService.remove(id);
  }
}