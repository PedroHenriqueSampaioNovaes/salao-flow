import {
  CreateAppointmentSchema,
  createAppointmentSchema,
} from '@sistema-barbearia/validators';

export const bookingFormSchema = createAppointmentSchema.omit({
  barbershopSlug: true,
});

export type BookingFormSchema = Omit<CreateAppointmentSchema, 'barbershopSlug'>;
