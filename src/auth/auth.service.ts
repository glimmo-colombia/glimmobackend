import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser({ email, password, name }: RegisterInput) {
  const hashedPassword = await argon2.hash(password);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true
    }
  });
  
  if (!user || !user.password || !await argon2.verify(user.password, password)) {
    throw new Error('Invalid credentials');
  }

  // Eliminamos el password antes de retornar
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}