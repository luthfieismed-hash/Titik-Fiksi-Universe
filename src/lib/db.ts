import { PrismaClient } from '@prisma/client';

// Pola Singleton untuk mencegah kebocoran koneksi di Vercel/Next.js hot reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Opsional: aktifkan log query hanya di mode development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;