import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  phone: z
    .string('Número de contato é obrigatório.')
    .regex(/^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/, 'Número de contato inválido.'),
  date: z.coerce.date(),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o padrão HH:MM'),
  employeeId: z.number(),
  serviceIds: z.array(z.uuid()),
});

export type CreateAppointmentSchema = z.infer<typeof CreateAppointmentSchema>;
