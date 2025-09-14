import { PrismaClient } from '@prisma/client'
import { beforeAll, afterAll } from 'vitest'

const prisma = new PrismaClient()

beforeAll(async () => {
  // Setup test database
  await prisma.$connect()
})

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect()
})