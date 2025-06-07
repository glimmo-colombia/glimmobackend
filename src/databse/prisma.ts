import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verificar conexión al iniciar
prisma.$connect()
  .then(() => console.log("✅ Conectado a MySQL con Prisma"))
    .catch((err: any) => console.error("❌ Error de conexión a MySQL:", err));

export default prisma;