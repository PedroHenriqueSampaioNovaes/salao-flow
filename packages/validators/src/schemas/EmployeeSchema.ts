import { z } from 'zod';

export const employeeSchema = z.object({
  name: z
    .string('Inserir o nome é obrigatório.')
    .min(3, 'Nome deve conter pelo menos 3 caracteres.'),
  image: z.string().optional(),
  employeeScheduleId: z.uuid(
    'É obrigatório definir um expediente para este funcionário.',
  ),
});

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.coerce.number('É obrigatório enviar o ID do funcionário.'),
});

export const detailsEmployeeSchema = z.object({
  id: z.coerce.number('É obrigatório enviar o ID do funcionário.'),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;
export type DetailsEmployeeSchema = z.infer<typeof detailsEmployeeSchema>;
