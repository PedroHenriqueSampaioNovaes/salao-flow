import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório.'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres.'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
