import { z } from 'zod';

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
      message: 'Selecione ao menos um funcionário para atribuir o serviço.',
      path: ['employeeIds'],
    });
  }
}

const baseServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  description: z.string().optional(),
  price: z
    .number('Obrigatório definir o preço do serviço.')
    .min(0.01, 'O preço tem que ser maior que R$ 0,01.'),
  duration: z
    .number('Obrigatório definir o tempo de duração do serviço.')
    .min(1, 'Os minutos tem que ser maior que 0.'),
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
