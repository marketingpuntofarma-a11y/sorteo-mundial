import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  
  const prisma = new PrismaClient({
    errorFormat: 'pretty',
  })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  return prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  }
});
