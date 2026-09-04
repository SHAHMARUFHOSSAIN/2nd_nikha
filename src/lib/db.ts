import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T, timeoutMs = 200): Promise<T> {
  try {
    const timer = new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs));
    return await Promise.race([queryFn(), timer]);
  } catch (e) {
    return fallback;
  }
}
