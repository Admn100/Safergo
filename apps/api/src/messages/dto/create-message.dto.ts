import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  senderId: string;

  @IsString()
  content: string;

  @IsString()
  conversationId: string;

  @IsOptional()
  @IsString()
  type?: string;
}