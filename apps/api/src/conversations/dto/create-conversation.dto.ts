import { IsString, IsArray } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  tripId: string;

  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}