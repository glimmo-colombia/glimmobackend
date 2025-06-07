import { FastifyInstance } from 'fastify';
import { registerUser, loginUser } from './auth.service';
import { sendResponse } from '../utils/response';
import { RegisterInput } from './auth.service';

export async function authRoutes(fastify: FastifyInstance) {
  // Registro
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body as RegisterInput;
    const user = await registerUser({ email, password, name });
    return sendResponse(reply, {
      status: 201,
      message: 'User registered',
      data: { id: user.id, email: user.email }
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const user = await loginUser(email, password);
    
    const token = fastify.jwt.sign({
      id: user.id
    });

    return sendResponse(reply, {
      message: 'Login successful',
      data: { token }
    });
  });
}