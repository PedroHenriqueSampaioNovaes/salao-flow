'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  EmployeeScheduleSchema,
  employeeScheduleSchema,
} from '@sistema-barbearia/validators';

interface UseProfessionalFormProps {
  defaultValues?: Partial<EmployeeScheduleSchema>;
}

function buildDefaultWeekdays(): EmployeeScheduleSchema['weekdays'] {
  return Array.from({ length: 7 }, (_, i) => ({
    weekday: i as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    isWorkingDay: true,
    start: '08:00',
    startLunch: '12:00',
    endLunch: '13:00',
    end: '18:00',
  }));
}

export function useExpedientForm({ defaultValues }: UseProfessionalFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm<EmployeeScheduleSchema>({
    resolver: zodResolver(employeeScheduleSchema),
    defaultValues: {
      name: '',
      weekdays: buildDefaultWeekdays(),
      ...defaultValues,
    },
  });

  return {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    errors,
  };
}
