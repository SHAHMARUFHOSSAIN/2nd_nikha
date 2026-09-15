import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

/**
 * Runs a Prisma query with an optional timeout. Unlike the previous
 * implementation this always attaches a `.catch` to the racing query so a
 * late rejection can never become an unhandled promise rejection.
 */
export async function queryWithTimeout<T>(
  queryFn: () => Promise<T>,
  fallback: T,
  timeoutMs = 1500
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });
  try {
    const result = await Promise.race([
      queryFn().catch(() => fallback),
      timeout,
    ]);
    clearTimeout(timer!);
    return result;
  } finally {
    clearTimeout(timer!);
  }
}

/** Alias kept for existing callers; prefers a sane default timeout. */
export const safeQuery = queryWithTimeout;