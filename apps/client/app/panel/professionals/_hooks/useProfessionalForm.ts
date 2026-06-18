'use client';

import { useMemo } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';

export const professionalFormSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  employeeScheduleId: z.string().min(1, 'Expediente é obrigatório'),
});

export type ProfessionalFormData = z.infer<typeof professionalFormSchema>;

interface UseProfessionalFormProps {
  employeeSchedules: IEmployeeSchedule[];
  defaultValues?: Partial<ProfessionalFormData>;
}

export function useProfessionalForm({
  employeeSchedules,
  defaultValues,
}: UseProfessionalFormProps) {
  const defaultEmployeeSchedule = useMemo(
    () => employeeSchedules.find(({ isDefault }) => isDefault),
    [employeeSchedules],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      image: '',
      name: '',
      employeeScheduleId: defaultEmployeeSchedule?.id || '',
      ...defaultValues,
    },
  });

  return {
    register,
    handleSubmit,
    errors,
    defaultEmployeeSchedule,
  };
}
