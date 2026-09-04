'use client';

import { SubmitHandler } from 'react-hook-form';

import createBlockedTimeAction from '@/app/actions/create-blocked-time';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import { CreateScheduleBlockFormData } from '@/src/common/schemas/blocked-time';

import { useBlockedTimesForm } from './useBlockedTimesForm';

interface UseCreateBlockedTimeFormProps {
  closeDialog: () => void;
}

export function useCreateBlockedTimeForm({
  closeDialog,
}: UseCreateBlockedTimeFormProps) {
  const { setBlockedTimes, employees } = usePanelContext();

  const { register, handleSubmit, formState, control, currentDate } =
    useBlockedTimesForm();

  const onSubmit: SubmitHandler<CreateScheduleBlockFormData> = async (data) => {
    const {
      data: blockedTimeCreated,
      ok,
      error,
    } = await createBlockedTimeAction({
      ...data,
      employeeIds: data.employeeIds.map(Number),
    });

    if (!ok) {
      showErrorToast(error || 'Erro ao criar bloqueio de horário.');
      return;
    }

    setBlockedTimes((prev) => [...prev, blockedTimeCreated!]);

    showSuccessToast('Bloqueio de horário criado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    control,
    employees,
    currentDate
  };
}
