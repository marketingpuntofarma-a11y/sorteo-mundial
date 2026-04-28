import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  
  const prisma = new PrismaClient({
    __internal: {
      useUds: false
    },
    datasources: {
      db: {
        url: process.env["POSTGRES_PRISMA_URL"] || process.env["DATABASE_URL"]
      }
    }
  } as any)
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  return prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getPrisma() as any)[prop];
  }
});
