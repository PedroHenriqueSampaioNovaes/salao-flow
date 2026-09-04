'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import {
  CreateScheduleBlockFormData,
  createScheduleBlockFormData,
} from '@/src/common/schemas/blocked-time';

interface UseBlockedTimesFormProps {
  defaultValues?: CreateScheduleBlockFormData;
}

export function useBlockedTimesForm({
  defaultValues,
}: UseBlockedTimesFormProps = {}) {
  const { barbershop } = usePanelContext();

  const currentDate = dateToInputDate(
    new Date(barbershop.instantLocalTime),
    barbershop.timezone,
  );

  const methods = useForm<CreateScheduleBlockFormData>({
    resolver: zodResolver(createScheduleBlockFormData),
    defaultValues: {
      name: '',
      initialDate: currentDate,
      finalDate: currentDate,
      initialTime: '',
      finalTime: '',
      employeeIds: [],
      ...defaultValues,
    },
  });

  return { ...methods, currentDate };
}
