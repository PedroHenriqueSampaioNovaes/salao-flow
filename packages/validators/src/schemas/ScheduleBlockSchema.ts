import { z } from 'zod';

export const CreateScheduleBlockSchema = z.object({
  name: z
    .string('É necessário informar um nome para o bloqueio de agendamento.')
    .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  initialDate: z.coerce.date(),
  finalDate: z.coerce.date(),
  initialTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM'),
  finalTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM'),
  employeeId: z.number(),
});

export type CreateScheduleBlockSchema = z.infer<
  typeof CreateScheduleBlockSchema
>;
