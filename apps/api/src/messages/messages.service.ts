import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        text: createMessageDto.content,
        senderId: createMessageDto.senderId,
        conversationId: createMessageDto.conversationId,
      },
    });
  }

  async findAll() {
    return this.prisma.message.findMany({
      include: {
        sender: true,
        conversation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        conversation: true,
      },
    });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: string) {
    return this.prisma.message.delete({
      where: { id },
    });
  }
}