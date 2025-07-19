const { PrismaClient } = require("@prisma/client");

const prismaClientSingleton = () => {
  return new PrismaClient();
};

global.prisma = undefined;

const prisma = global.prisma ?? prismaClientSingleton();

module.exports = prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;