import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        omit: { user: { password: true } },
        datasourceUrl: process.env.DIRECT_URL,
    });
// password won't be send in any query

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
