'use client';

import { useRouter } from 'next/navigation';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';
import { IEmployee } from '@/src/common/interfaces/employee';

import updateEmployeeAction from '@/app/actions/update-employee';

import { ProfessionalForm } from '../../../_components/ProfessionalForm';
import { ProfessionalFormData } from '../../../_hooks/useProfessionalForm';

interface IEditFormProps {
  employeeSchedules: IEmployeeSchedule[];
  employee: IEmployee;
}

export default function EditForm({
  employee,
  employeeSchedules,
}: IEditFormProps) {
  const router = useRouter();

  async function onSubmit(data: ProfessionalFormData) {
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
