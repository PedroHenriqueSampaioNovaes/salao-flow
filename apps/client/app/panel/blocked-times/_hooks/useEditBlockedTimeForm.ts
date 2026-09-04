'use client';

import { SubmitHandler } from 'react-hook-form';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';
import { dateToInputTime } from '@/src/common/utils/dateToInputTime';

import updateBlockedTimesAction from '@/app/actions/update-blocked-times';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import { CreateScheduleBlockFormData } from '@/src/common/schemas/blocked-time';

import { useBlockedTimesForm } from './useBlockedTimesForm';

interface UseEditBlockedTimeFormProps {
  blockedTimeId: string;
  closeDialog: () => void;
}

export function useEditBlockedTimeForm({
  blockedTimeId,
  closeDialog,
}: UseEditBlockedTimeFormProps) {
  const { blockedTimes, setBlockedTimes, barbershop, employees } =
    usePanelContext();

  const blockedTime = blockedTimes.find((e) => e.id === blockedTimeId);

  const { register, handleSubmit, formState, control, currentDate } =
    useBlockedTimesForm({
      defaultValues: {
        name: blockedTime?.name || '',
        initialDate: dateToInputDate(
          blockedTime?.initialDate ?? '',
          barbershop.timezone,
        ),
        finalDate: dateToInputDate(
          blockedTime?.finalDate ?? '',
          barbershop.timezone,
        ),
        initialTime: dateToInputTime(
          blockedTime?.initialDate ?? '',
          barbershop.timezone,
        ),
        finalTime: dateToInputTime(
          blockedTime?.finalDate ?? '',
          barbershop.timezone,
        ),
        employeeIds: blockedTime?.employees.map((e) => String(e.id)) ?? [],
      },
    });

  const onSubmit: SubmitHandler<CreateScheduleBlockFormData> = async (data) => {
    if (!blockedTime) return;

    const {
      data: blockedTimeUpdated,
      ok,
      error,
    } = await updateBlockedTimesAction(blockedTime.id, {
      ...data,
      employeeIds: data.employeeIds.map(Number),
    });

    if (!ok) {
      showErrorToast(error || 'Erro ao atualizar bloqueio de horário.');
      return;
    }

    setBlockedTimes((prev) =>
      prev.map((e) => (e.id === blockedTimeId ? blockedTimeUpdated! : e)),
    );

    showSuccessToast('Bloqueio de horário atualizado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    control,
    employees,
    currentDate,
  };
}
