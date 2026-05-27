import { z } from 'zod';

export const UpdateBarbershopSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve conter pelo menos 3 caracteres.')
      .optional(),
    email: z.email('E-mail inválido.').optional(),
    image: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Senha deve conter pelo menos 8 caracteres.')
      .optional(),
    confirmPassword: z.string().optional(),
    slug: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    },
  );

export type UpdateBarbershopSchema = z.infer<typeof UpdateBarbershopSchema>;
