import { Module } from '@nestjs/common';
import { PlaceReviewsService } from './place-reviews.service';
import { PlaceReviewsController } from './place-reviews.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PlaceReviewsService],
  controllers: [PlaceReviewsController],
  exports: [PlaceReviewsService],
})
export class PlaceReviewsModule {}