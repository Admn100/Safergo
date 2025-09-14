import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement admin methods
}