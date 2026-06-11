import { z } from 'zod';

export const createScheduleBlockSchema = z.object({
  name: z
    .string('É necessário informar um nome para o bloqueio de agendamento.')
    .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  initialDate: z.coerce.date(),
  finalDate: z.coerce.date(),
  employeeId: z.number(),
});

export type CreateScheduleBlockSchema = z.infer<
  typeof createScheduleBlockSchema
>;

export const updateScheduleBlockSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .optional(),
  initialDate: z.coerce.date().optional(),
  finalDate: z.coerce.date().optional(),
  employeeId: z.number().optional(),
});

export type UpdateScheduleBlockSchema = z.infer<
  typeof updateScheduleBlockSchema
>;
