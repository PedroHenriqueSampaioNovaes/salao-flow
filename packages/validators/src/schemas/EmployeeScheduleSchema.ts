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

export const EmployeeScheduleSchema = z.object({
  name: z.string('Obrigatório inserir o nome.'),
  weekdays: z
    .array(
      z.object({
        weekday: z.enum(Weekday, {
          error: 'Dia da semana inválido.',
        }),
        isWorkingDay: z.coerce.boolean('Obrigatório informar se é dia útil.'),
        start: z
          .string('O horário tem que seguir o padrão HH:MM')
          .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
          .optional()
          .transform((value) => value || null),
        startLunch: z
          .string('O horário tem que seguir o padrão HH:MM')
          .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
          .optional()
          .transform((value) => value || null),
        endLunch: z
          .string('O horário tem que seguir o padrão HH:MM')
          .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
          .optional()
          .transform((value) => value || null),
        end: z
          .string('O horário tem que seguir o padrão HH:MM')
          .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM')
          .optional()
          .transform((value) => value || null),
      }),
    )
    .length(7, 'Obrigatório inserir os horários para todos os dias da semana.'),
});

export type EmployeeScheduleSchema = z.infer<typeof EmployeeScheduleSchema>;
