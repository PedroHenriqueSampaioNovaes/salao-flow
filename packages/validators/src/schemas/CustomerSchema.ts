import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  phone: z
    .string('Número de contato é obrigatório.')
    .regex(/^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/, 'Número de contato inválido.'),
  email: z.email('E-mail inválido.').optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  id: z.coerce.number('É obrigatório enviar o ID do cliente.'),
  isBlocked: z.boolean().optional(),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;
