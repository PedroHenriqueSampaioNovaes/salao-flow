import z from 'zod';

export const UserSchema = z
  .object({
    name: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres.'),
    email: z.email('E-mail inválido.'),
    image: z.string().optional(),
    password: z.string().min(8, 'Senha deve conter pelo menos 8 caracteres.'),
    confirmPassword: z.string('Obrigatório a confirmação de senha.'),
    address: z.string('Obrigatório o endereço.'),
    phone: z.string('Obrigatório o telefone.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type UserSchema = z.infer<typeof UserSchema>;
