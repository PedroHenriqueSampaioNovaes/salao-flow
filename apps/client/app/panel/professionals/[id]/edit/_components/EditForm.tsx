'use client';

import { useRouter } from 'next/navigation';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';

import updateEmployeeAction from '@/app/actions/update-employee';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { ProfessionalForm } from '../../../_components/ProfessionalForm';
import { ProfessionalFormData } from '../../../_hooks/useProfessionalForm';

interface IEditFormProps {
  employeeSchedules: IEmployeeSchedule[];
  employeeId: number;
}

export default function EditForm({
  employeeSchedules,
  employeeId,
}: IEditFormProps) {
  const { employees } = usePanelContext();
  const employee = employees.find((e) => e.id === employeeId);

  const router = useRouter();

  if (!employee) {
    return <h1>Funcionário não encontrado</h1>;
  }

  async function onSubmit(data: ProfessionalFormData) {
    if (!employee) return;

    const { ok, error } = await updateEmployeeAction({
      id: employee.id,
      employeeData: data,
    });

    if (!ok) return alert(error);

    router.push('/panel/professionals');
  }

  return (
    <ProfessionalForm
      employeeSchedules={employeeSchedules}
      onSubmit={onSubmit}
      submitLabel="Editar"
      defaultValues={{
        name: employee.name,
        employeeScheduleId: employee.employeeScheduleId,
      }}
    />
  );
}
