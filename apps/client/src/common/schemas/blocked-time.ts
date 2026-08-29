import z from 'zod';

import { createScheduleBlockSchema } from '@sistema-barbearia/validators';

export const createScheduleBlockFormData = createScheduleBlockSchema
  .omit({ employeeIds: true })
  .extend({
    employeeIds: z
      .array(z.string())
      .min(1, 'Selecione pelo menos um profissional.'),
  });

export type CreateScheduleBlockFormData = z.infer<
  typeof createScheduleBlockFormData
>;
