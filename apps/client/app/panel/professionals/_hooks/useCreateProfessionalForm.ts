'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeSchema } from '@sistema-barbearia/validators';

import createEmployeeAction from '@/app/actions/create-employee';
import getEmployeeSchedulesAction from '@/app/actions/get-employee-schedules';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';

interface UseCreateProfessionalFormProps {
  closeDialog: () => void;
}

export function useCreateProfessionalForm({
  closeDialog,
}: UseCreateProfessionalFormProps) {
  const { setEmployees } = usePanelContext();
  const [employeeSchedules, setEmployeeSchedules] = useState<
    IEmployeeSchedule[]
  >([]);

  const { register, handleSubmit, formState, setValue } =
    useForm<EmployeeSchema>({
      resolver: zodResolver(employeeSchema),
      defaultValues: {
        name: '',
        employeeScheduleId: '',
      },
    });

  useEffect(() => {
    async function loadEmployeeSchedules() {
      const { data, ok } = await getEmployeeSchedulesAction();

      if (!ok || !data) return;

      setEmployeeSchedules(data);

      const defaultEmployeeSchedule = data.find(
        (employeeSchedule) => employeeSchedule.isDefault,
      );

      if (defaultEmployeeSchedule) {
        setValue('employeeScheduleId', defaultEmployeeSchedule.id);
      }
    }

    loadEmployeeSchedules();
  }, [setValue]);

  async function onSubmit(data: EmployeeSchema) {
    const {
      data: employeeResponse,
      ok,
      error,
    } = await createEmployeeAction({ ...data, image: undefined });

    if (!ok) {
      showErrorToast(error || 'Erro ao criar profissional.');
      return;
    }

    setEmployees((prev) => [...prev, employeeResponse!]);

    showSuccessToast('Profissional criado com sucesso!');
    closeDialog();
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    employeeSchedules,
  };
}
