import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
