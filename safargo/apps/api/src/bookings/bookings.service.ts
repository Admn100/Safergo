import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement booking methods
}