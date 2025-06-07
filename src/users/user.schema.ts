import { Static, Type } from '@sinclair/typebox';

export const CreateUserSchema = Type.Object({
  name: Type.Optional(Type.String()),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 })
});

export type CreateUserInput = Static<typeof CreateUserSchema>;