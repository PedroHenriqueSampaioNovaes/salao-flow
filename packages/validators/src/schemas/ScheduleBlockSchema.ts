import { z } from 'zod';

export const createScheduleBlockSchema = z.object({
  name: z
    .string()
    .min(1, 'É necessário informar um nome para o bloqueio de agendamento.'),
  initialDate: z.coerce.date(),
  finalDate: z.coerce.date(),
  employeeIds: z
    .array(z.number())
    .min(1, 'Selecione pelo menos um profissional.'),
});

export type CreateScheduleBlockSchema = z.infer<
  typeof createScheduleBlockSchema
>;

export const updateScheduleBlockSchema = createScheduleBlockSchema.partial();

export type UpdateScheduleBlockSchema = z.infer<
  typeof updateScheduleBlockSchema
>;
