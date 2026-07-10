'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { createScheduleBlockSchema } from '@sistema-barbearia/validators';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

const createScheduleBlockFormData = createScheduleBlockSchema
  .omit({ initialDate: true, finalDate: true, employeeIds: true })
  .extend({
    initialDate: z.string(),
    finalDate: z.string(),
    initialTime: z.string().min(4, 'Informe um horário inicial.'),
    finalTime: z.string().min(4, 'Informe um horário final.'),
    employeeIds: z
      .array(z.string())
      .min(1, 'Selecione pelo menos um profissional.'),
  });

export type CreateScheduleBlockFormData = z.infer<
  typeof createScheduleBlockFormData
>;

interface UseBlockedTimesFormProps {
  defaultValues?: Partial<CreateScheduleBlockFormData>;
}

const date = new Date();

export function useBlockedTimesForm({
  defaultValues,
}: UseBlockedTimesFormProps) {
  const { barbershop } = usePanelContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateScheduleBlockFormData>({
    resolver: zodResolver(createScheduleBlockFormData),
    defaultValues: {
      name: '',
      initialDate: dateToInputDate(date, barbershop.timezone),
      finalDate: dateToInputDate(date, barbershop.timezone),
      initialTime: '',
      finalTime: '',
      employeeIds: [],
      ...defaultValues,
    },
  });

  return {
    register,
    handleSubmit,
    control,
    errors,
  };
}
