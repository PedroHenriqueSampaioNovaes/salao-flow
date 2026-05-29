import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  price: z
    .string('Obrigatório definir o preço do serviço.')
    .regex(/^\d+$/, 'Só é permitido números como preço.')
    .transform((value) => Number(value)),
  duration: z
    .string('Obrigatório definir o tempo de duração do serviço.')
    .regex(/^\d+$/, 'Só é permitido números como tempo de duração do serviço.')
    .transform((value) => Number(value)),
  employeeId: z
    .number(
      'É obrigatório informar qual funcionário será responsável por este serviço.',
    )
    .optional(),
});

export type CreateServiceSchema = z.infer<typeof CreateServiceSchema>;
