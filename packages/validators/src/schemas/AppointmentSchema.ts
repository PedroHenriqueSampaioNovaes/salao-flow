import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z
    .string('Data é obrigatória (YYYY-MM-DD).')
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'A data tem que seguir o formato YYYY-MM-DD.',
    ),
  time: z
    .string('Horário é obrigatório (HH:mm).')
    .regex(/^\d{2}:\d{2}$/, 'O horário tem que seguir o formato HH:mm.'),
  barbershopSlug: z.string('É necessário informar o slug da barbearia.'),
  employeeId: z.number(),
  serviceIds: z.array(z.uuid()),
  name: z.string().min(1, 'Nome é obrigatório.'),
  phone: z
    .string('Número de contato é obrigatório.')
    .regex(/^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/, 'Número de contato inválido.'),
  email: z.email('E-mail inválido.'),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
