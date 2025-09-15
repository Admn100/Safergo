import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceReviewDto } from './create-place-review.dto';

export class UpdatePlaceReviewDto extends PartialType(CreatePlaceReviewDto) {}