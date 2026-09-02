'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeeScheduleSchema,
  EmployeeScheduleSchema,
} from '@sistema-barbearia/validators';

import createExpedientAction from '@/app/actions/create-expedient';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

function buildDefaultWeekdays(): EmployeeScheduleSchema['weekdays'] {
  return Array.from({ length: 7 }, (_, i) => ({
    weekday: i,
    isWorkingDay: true,
    start: '09:00',
    startLunch: '12:00',
    endLunch: '13:00',
    end: '18:00',
  }));
}

interface UseCreateExpedientFormProps {
  closeDialog: () => void;
}

export function useCreateExpedientForm({
  closeDialog,
}: UseCreateExpedientFormProps) {
  const { setExpedients } = usePanelContext();

  const { register, handleSubmit, control, watch, formState } =
    useForm<EmployeeScheduleSchema>({
      resolver: zodResolver(employeeScheduleSchema),
      defaultValues: {
        name: '',
        weekdays: buildDefaultWeekdays(),
      },
    });

  async function onSubmit(data: EmployeeScheduleSchema) {
    const {
      data: expedientResponse,
      ok,
      error,
    } = await createExpedientAction(data);

    if (!ok) {
      showErrorToast(error || 'Erro ao criar expediente.');
      return;
    }

    setExpedients((prev) => [...prev, expedientResponse!]);

    showSuccessToast('Expediente criado com sucesso!');
    closeDialog();
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    watch,
    errors: formState.errors,
  };
}
