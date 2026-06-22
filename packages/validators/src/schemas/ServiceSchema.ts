import { z } from 'zod';

const REQUIRED_EMPLOYEE_MESSAGE =
  'É obrigatório informar qual funcionário será responsável por este serviço.';

type ServiceEmployeeAssignment = {
  assignToAllEmployees?: boolean;
  employeeIds?: number[];
};

function validateEmployeeAssignment(
  data: ServiceEmployeeAssignment,
  ctx: z.RefinementCtx,
) {
  if (
    !data.assignToAllEmployees &&
    (!data.employeeIds || data.employeeIds.length === 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      message: REQUIRED_EMPLOYEE_MESSAGE,
      path: ['employeeIds'],
    });
  }
}

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
  status: z.boolean(),
  assignToAllEmployees: z.boolean(),
  employeeIds: z.array(z.number()).optional(),
});

export const serviceSchema = baseServiceSchema.superRefine(
  validateEmployeeAssignment,
);

export const updateServiceSchema = baseServiceSchema
  .partial()
  .extend({
    id: z.uuid('É obrigatório enviar o ID do serviço.'),
  })
  .superRefine(validateEmployeeAssignment);

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;
