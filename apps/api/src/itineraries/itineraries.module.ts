import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ItinerariesService],
  controllers: [ItinerariesController],
  exports: [ItinerariesService],
})
export class ItinerariesModule {}