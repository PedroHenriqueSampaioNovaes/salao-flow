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

export type EmployeeSchema = z.infer<typeof EmployeeSchema>;
