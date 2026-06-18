'use client';

import { useRouter } from 'next/navigation';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';

import createEmployeeAction from '@/app/actions/create-employee';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { ProfessionalForm } from '../../_components/ProfessionalForm';
import { ProfessionalFormData } from '../../_hooks/useProfessionalForm';

interface INewFormProps {
  employeeSchedules: IEmployeeSchedule[];
}

export default function NewForm({ employeeSchedules }: INewFormProps) {
  const router = useRouter();

  const { setEmployees } = usePanelContext();

  async function onSubmit(data: ProfessionalFormData) {
    const {
      data: employeeResponse,
      ok,
      error,
    } = await createEmployeeAction({
      ...data,
      image: undefined,
    });

    if (!ok) return alert(error);

    setEmployees((prev) => [...prev, employeeResponse!]);
    router.push('/panel/professionals');
  }

  return (
    <ProfessionalForm
      employeeSchedules={employeeSchedules}
      onSubmit={onSubmit}
    />
  );
}
