import { PrismaClient } from "@prisma/client";

const prismaClient = globalThis.__prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prismaClient;
}

export const prisma = prismaClient;
