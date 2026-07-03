import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z.coerce.date(),
  barbershopSlug: z.string('É necessário informar o slug da barbearia.'),
  employeeId: z.number(),
  serviceIds: z.array(z.uuid()),
  name: z.string().min(1, 'Nome é obrigatório.'),
  phone: z
    .string('Número de contato é obrigatório.')
    .regex(/^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/, 'Número de contato inválido.'),
  email: z.email('E-mail inválido.').optional().or(z.literal('')),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
