'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employeeScheduleSchema,
  EmployeeScheduleSchema,
} from '@sistema-barbearia/validators';

import updateExpedientAction from '@/app/actions/update-expedient';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

interface UseEditExpedientFormProps {
  expedientId: string;
  closeDialog: () => void;
}

export function useEditExpedientForm({
  expedientId,
  closeDialog,
}: UseEditExpedientFormProps) {
  const { expedients, setExpedients } = usePanelContext();

  const expedient = expedients.find((e) => e.id === expedientId);

  const { register, handleSubmit, control, watch, formState } =
    useForm<EmployeeScheduleSchema>({
      resolver: zodResolver(employeeScheduleSchema),
      defaultValues: {
        name: expedient?.name || '',
        weekdays:
          expedient?.employeeScheduleWeekdays.map((weekday) => ({
            weekday: weekday.weekday,
            start: weekday.start || '09:00',
            end: weekday.end || '18:00',
            startLunch: weekday.startLunch || '12:00',
            endLunch: weekday.endLunch || '13:00',
            isWorkingDay: weekday.isWorkingDay,
          })) ?? [],
      },
    });

  const onSubmit = async (data: EmployeeScheduleSchema) => {
    if (!expedient) return;

    const {
      data: expedientUpdated,
      ok,
      error,
    } = await updateExpedientAction(expedient.id, data);

    if (!ok) {
      showErrorToast(error || 'Erro ao atualizar expediente.');
      return;
    }

    setExpedients((prev) =>
      prev.map((e) => (e.id === expedientId ? expedientUpdated! : e)),
    );

    showSuccessToast('Expediente atualizado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    watch,
    errors: formState.errors,
  };
}
