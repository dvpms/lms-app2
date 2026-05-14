import { PrismaClient } from '../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaNeon } from '@prisma/adapter-neon'

function createAdapter() {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  }
  return new PrismaPg({ connectionString: process.env.DATABASE_URL })
}

const adapter = createAdapter()
export const prisma = new PrismaClient({ adapter })
