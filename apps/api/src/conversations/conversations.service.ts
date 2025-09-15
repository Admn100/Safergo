import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        ...createConversationDto,
        participants: {
          connect: createConversationDto.participantIds.map(id => ({ id })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: {
        participants: true,
        messages: true,
        trip: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: true,
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        trip: true,
      },
    });
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    return this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }
}