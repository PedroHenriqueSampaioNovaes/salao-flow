import { z } from 'zod';

const baseServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  description: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres.')
    .optional(),
  price: z
    .string('Obrigatório definir o preço do serviço.')
    .regex(/^\d+$/, 'Só é permitido números como preço.')
    .transform((value) => Number(value)),
  duration: z
    .string('Obrigatório definir o tempo de duração do serviço.')
    .regex(/^\d+$/, 'Só é permitido números como tempo de duração do serviço.')
    .transform((value) => Number(value)),
  status: z.boolean().optional(),
  assignToAllEmployees: z.boolean(),
  employeeId: z
    .number(
      'É obrigatório informar qual funcionário será responsável por este serviço.',
    )
    .optional(),
});

export const serviceSchema = baseServiceSchema.superRefine((data, ctx) => {
  if (!data.assignToAllEmployees && !data.employeeId) {
    ctx.addIssue({
      code: 'custom',
      message:
        'É obrigatório informar qual funcionário será responsável por este serviço.',
      path: ['employeeId'],
    });
  }
});

export const updateServiceSchema = baseServiceSchema.partial().extend({
  id: z.uuid('É obrigatório enviar o ID do serviço.'),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
