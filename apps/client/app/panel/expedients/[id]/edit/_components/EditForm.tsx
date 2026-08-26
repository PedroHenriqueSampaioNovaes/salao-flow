'use client';

import { useRouter } from 'next/navigation';

import updateExpedientAction from '@/app/actions/update-expedient';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { ExpedientForm } from '../../../_components/ExpedientForm';

interface IEditFormProps {
  expedientId: string;
}

export default function EditForm({ expedientId }: IEditFormProps) {
  const { expedients, setExpedients } = usePanelContext();

  const expedient = expedients.find((e) => e.id === expedientId);

  const router = useRouter();

  if (!expedient) {
    return <h1>Expediente não encontrado</h1>;
  }

  async function onSubmit(data: EmployeeScheduleSchema) {
    if (!expedient) return;

    const {
      data: employeeUpdated,
      ok,
      error,
    } = await updateExpedientAction(expedient.id, data);

    if (!ok) return alert(error);

    setExpedients((prev) =>
      prev.map((e) => (e.id === expedient.id ? employeeUpdated! : e)),
    );

    router.push('/panel/expedients');
  }

  return (
    <ExpedientForm
      onSubmit={onSubmit}
      submitLabel="Editar"
      defaultValues={{
        name: expedient.name,
        weekdays: expedient.employeeScheduleWeekdays.map((weekday) => ({
          weekday: weekday.weekday,
          start: weekday.start,
          end: weekday.end,
          startLunch: weekday.startLunch,
          endLunch: weekday.endLunch,
          isWorkingDay: weekday.isWorkingDay,
        })),
      }}
    />
  );
}
