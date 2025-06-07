import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { userRoutes } from './users';
import prisma from './databse/prisma';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import secureSession from '@fastify/secure-session';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyAuth from '@fastify/auth';
import { authRoutes } from './auth/auth.controller';

export function buildApp() {
  const app = fastify();

  // Configuración JWT
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret', // Usa una variable de entorno en producción!
    sign: {
      expiresIn: '1h'
    }
  });

  app.register(fastifyAuth); // Para usar decoradores de autenticación

  // Decorador para verificar JWT
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(new Error('Invalid token'));
    }
  });

  app.register(cors, {
    origin: ['https://localhost:4200'], // Reemplaza con tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

// Añade verificación de la variable de entorno
if (!process.env.SESSION_KEY) {
  throw new Error('SESSION_KEY is missing in .env file');
}

app.register(secureSession, {
  key: Buffer.from(process.env.SESSION_KEY, 'hex'),
  cookie: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
});

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    }
  });

  // Registrar plugins y rutas
  app.register(userRoutes, { prefix: '/users' });
  app.register(authRoutes, { prefix: '/auth' });

  // Manejo de errores global
  app.setErrorHandler((error, request, reply) => {
    reply.status(500).send({
      data: null,
      status: 500,
      message: 'Internal server error',
    });
  });

  // Cerrar Prisma al apagar el servidor
  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
}

