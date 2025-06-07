import { FastifyInstance, FastifyRequest } from 'fastify';
import { CreateUserInput, CreateUserSchema } from './user.schema';
import { createUser, getUsers } from './user.service';
import { sendResponse } from '../utils/response';

export async function userRoutes(fastify: FastifyInstance) {
  // Registrar esquema de validación
  fastify.addSchema({
    $id: 'createUserSchema',
    ...CreateUserSchema,
  });

  // Obtener todos los usuarios
  fastify.get('/', async (request, reply) => {
    const users = await getUsers();
    return sendResponse(reply, {
      data: users,
      message: 'Users retrieved successfully',
    });
  });

  // Crear un usuario
  fastify.post(
    '/',
    {
      schema: {
        body: CreateUserSchema, // Usa el esquema actualizado
      },
    },
    async (request: FastifyRequest<{ Body: CreateUserInput }>, reply) => {
      const user = await createUser(request.body);
      return sendResponse(reply, {
        data: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        status: 201,
        message: 'User created successfully',
      });
    }
  );
}