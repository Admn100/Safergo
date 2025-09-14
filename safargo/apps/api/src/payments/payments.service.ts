import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement payment methods with Stripe
}