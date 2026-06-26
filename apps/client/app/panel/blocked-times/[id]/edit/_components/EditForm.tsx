'use client';

import { useRouter } from 'next/navigation';

import updateBlockedTimesAction from '@/app/actions/update-blocked-times';

import { BlockedTimesForm } from '../../../_components/BlockedTimesForm';

import { useBlockedTimesContext } from '@/src/common/contexts/blocked-times-context';

import { dateToInputDate } from '@/src/common/utils/dateToInputDate';
import { dateToInputTime } from '@/src/common/utils/dateToInputTime';

import { CreateScheduleBlockFormData } from '../../../_hooks/useBlockedTimesForm';

interface IEditFormProps {
  blockedTimeId: string;
}

export default function EditForm({ blockedTimeId }: IEditFormProps) {
  const { blockedTimes, setBlockedTimes } = useBlockedTimesContext();

  const blockedTime = blockedTimes.find((e) => e.id === blockedTimeId);

  const router = useRouter();

  if (!blockedTime) {
    return <h1>Bloqueio de horário não encontrado</h1>;
  }

  async function onSubmit(data: CreateScheduleBlockFormData) {
    if (!blockedTime) return;

    const {
      data: blockedTimeUpdated,
      ok,
      error,
    } = await updateBlockedTimesAction(blockedTime.id, {
      ...data,
      initialDate: data.initialDate,
      finalDate: data.finalDate,
      employeeIds: data.employeeIds?.map((id) => Number(id)),
    });

    if (!ok) return alert(error);

    setBlockedTimes((prev) =>
      prev.map((e) => (e.id === blockedTimeId ? blockedTimeUpdated! : e)),
    );

    router.push('/panel/blocked-times');
  }

  return (
    <BlockedTimesForm
      onSubmit={onSubmit}
      submitLabel="Editar"
      defaultValues={{
        name: blockedTime.name,
        initialDate: dateToInputDate(blockedTime.initialDate),
        finalDate: dateToInputDate(blockedTime.finalDate),
        initialTime: dateToInputTime(blockedTime.initialDate),
        finalTime: dateToInputTime(blockedTime.finalDate),
        employeeIds: blockedTime.employees.map((e) => String(e.id)),
      }}
    />
  );
}
