import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  date: z.coerce.date(),
  barbershopSlug: z.string('É necessário informar o slug da barbearia.'),
  employeeId: z.number(),
  serviceIds: z.array(z.uuid()),
});

export type CreateAppointmentSchema = z.infer<typeof CreateAppointmentSchema>;
