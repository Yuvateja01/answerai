import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Ensure the globalThis object includes the prismaGlobal property
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// Use the existing instance or create a new one
const prisma = globalThis.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
