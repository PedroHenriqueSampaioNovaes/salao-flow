import { z } from 'zod';

enum Weekday {
  Domingo = 0,
  Segunda = 1,
  Terca = 2,
  Quarta = 3,
  Quinta = 4,
  Sexta = 5,
  Sabado = 6,
}

export const weekdayScheduleSchema = z.object({
  weekday: z.enum(Weekday, {
    error: 'Dia da semana inválido.',
  }),
  isWorkingDay: z.coerce.boolean<boolean>(
    'Obrigatório informar se é dia útil.',
  ),
  start: z
    .string('O horário tem que seguir o padrão HH:MM')
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
    .transform((value) => value || null)
    .nullable()
    .optional(),
  startLunch: z
    .string('O horário tem que seguir o padrão HH:MM')
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
    .transform((value) => value || null)
    .nullable()
    .optional(),
  endLunch: z
    .string('O horário tem que seguir o padrão HH:MM')
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
    .transform((value) => value || null)
    .nullable()
    .optional(),
  end: z
    .string('O horário tem que seguir o padrão HH:MM')
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
    .transform((value) => value || null)
    .nullable()
    .optional(),
});

export const employeeScheduleSchema = z.object({
  name: z
    .string('Obrigatório inserir o nome.')
    .min(3, 'Nome precisa ter no mínimo 3 caracteres.'),
  weekdays: z
    .array(weekdayScheduleSchema)
    .length(7, 'Obrigatório inserir os horários para todos os dias da semana.'),
});

export const updateEmployeeScheduleSchema = employeeScheduleSchema
  .partial()
  .extend({
    weekdays: z.array(weekdayScheduleSchema).optional(),
  });

export type EmployeeScheduleSchema = z.infer<typeof employeeScheduleSchema>;
export type UpdateEmployeeScheduleSchema = z.infer<
  typeof updateEmployeeScheduleSchema
>;
