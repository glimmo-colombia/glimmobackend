import { FastifyReply } from 'fastify';

// Tipos genéricos para respuestas
type SuccessResponse<T> = {
  data: T;
  status?: number;
  message: string;
};

type ErrorResponse = {
  data: null;
  status: number;
  message: string;
};

export function sendResponse<T>(
  reply: FastifyReply,
  response: SuccessResponse<T> | ErrorResponse
) {
  const { data, status = 200, message } = response;
  return reply.code(status).send({ data, status, message });
}