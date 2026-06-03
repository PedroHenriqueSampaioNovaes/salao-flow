import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  date: z.coerce.date(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM'),
  employeeId: z.number(),
  serviceIds: z.array(z.uuid()),
});

export type CreateAppointmentSchema = z.infer<typeof CreateAppointmentSchema>;
