import { z } from 'zod';

export const createBarbershopSchema = z
  .object({
    name: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres'),
    email: z.email('E-mail inválido'),
    image: z.string().optional(),
    password: z.string().min(8, 'Senha deve conter pelo menos 8 caracteres'),
    confirmPassword: z.string('Obrigatório a confirmação de senha'),
    address: z.string('Obrigatório o endereço.').min(1, 'Endereço inválido'),
    phone: z
      .string('Obrigatório o telefone')
      .regex(
        /^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/,
        'Número de contato inválido',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type CreateBarbershopSchema = z.infer<typeof createBarbershopSchema>;
