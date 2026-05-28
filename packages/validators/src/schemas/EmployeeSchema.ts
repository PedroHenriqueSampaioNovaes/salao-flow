import z from 'zod';

export const EmployeeSchema = z.object({
  name: z
    .string('Inserir o nome é obrigatório.')
    .min(3, 'Nome deve conter pelo menos 3 caracteres.'),
  image: z.string().optional(),
  operatingTimeId: z.uuid(
    'É obrigatório definir um expediente para este funcionário.',
  ),
});

export const UpdateEmployeeSchema = EmployeeSchema.partial().extend({
  id: z.coerce.number('É obrigatório enviar o ID do funcionário.'),
});

export const DetailsEmployeeSchema = z.object({
  id: z.coerce.number('É obrigatório enviar o ID do funcionário.'),
});

export type EmployeeSchema = z.infer<typeof EmployeeSchema>;
export type UpdateEmployeeSchema = z.infer<typeof UpdateEmployeeSchema>;
export type DetailsEmployeeSchema = z.infer<typeof DetailsEmployeeSchema>;
