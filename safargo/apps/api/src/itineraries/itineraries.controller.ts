import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ItinerariesService } from './itineraries.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all itineraries' })
  async findAll() {
    return this.itinerariesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get itinerary by ID' })
  async findById(@Param('id') id: string) {
    return this.itinerariesService.findById(id);
  }
}