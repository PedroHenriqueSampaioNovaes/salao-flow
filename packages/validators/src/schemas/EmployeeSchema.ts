import z from 'zod';

export const EmployeeSchema = z.object({
  name: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres.'),
  image: z.string().optional(),
  times: z
    .array(z.string())
    .min(3, 'Deve haver pelo menos 3 horários de funcionamento.'),
});

export type EmployeeSchema = z.infer<typeof EmployeeSchema>;
