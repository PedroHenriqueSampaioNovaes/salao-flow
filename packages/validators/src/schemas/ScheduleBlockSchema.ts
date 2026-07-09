import { z } from 'zod';

export const createScheduleBlockSchema = z.object({
  name: z
    .string()
    .min(1, 'É necessário informar um nome para o bloqueio de agendamento.'),
  initialDate: z
    .string('A data inicial é obrigatória (YYYY-MM-DD).')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data inicial tem que seguir o formato YYYY-MM-DD.',
    ),
  initialTime: z
    .string('O horário inicial é obrigatório (HH:mm).')
    .regex(
      /^\d{2}:\d{2}$/,
      'O horário inicial tem que seguir o formato HH:mm.',
    ),
  finalDate: z
    .string('A data final é obrigatória (YYYY-MM-DD).')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data final tem que seguir o formato YYYY-MM-DD.',
    ),
  finalTime: z
    .string('O horário final é obrigatório (HH:mm).')
    .regex(/^\d{2}:\d{2}$/, 'O horário final tem que seguir o formato HH:mm.'),
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
