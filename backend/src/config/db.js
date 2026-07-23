const { PrismaClient } = require("@prisma/client");

// Ilova davomida bitta Prisma instance ishlatamiz (best practice)
const prisma = new PrismaClient();

module.exports = prisma;
