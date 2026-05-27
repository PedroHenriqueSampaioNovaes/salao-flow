import z from 'zod';

export const EmployeeSchema = z.object({
  name: z.string().min(3, 'Nome deve conter pelo menos 3 caracteres.'),
  image: z.string().optional(),
  operatingTime: z.object({
    start: z.string(),
    startLunch: z.string(),
    endLunch: z.string(),
    end: z.string(),
  }),
});

export type EmployeeSchema = z.infer<typeof EmployeeSchema>;
