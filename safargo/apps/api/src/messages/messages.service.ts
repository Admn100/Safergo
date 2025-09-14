import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement messaging methods
}