import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { CreateUserInput } from './user.schema';

const prisma = new PrismaClient();

export async function createUser(input: CreateUserInput) {
  const hashedPassword = await argon2.hash(input.password);
  
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword
    }
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
      // No incluir password
    }
  });
}