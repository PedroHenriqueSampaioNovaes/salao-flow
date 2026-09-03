'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeSchema, employeeSchema } from '@sistema-barbearia/validators';

import updateEmployeeAction from '@/app/actions/update-employee';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

interface UseEditProfessionalFormProps {
  employeeId: number;
  closeDialog: () => void;
}

export function useEditProfessionalForm({
  employeeId,
  closeDialog,
}: UseEditProfessionalFormProps) {
  const { employees, setEmployees, expedients } = usePanelContext();

  const employee = employees.find((e) => e.id === employeeId);

  const { register, handleSubmit, formState } = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || '',
      employeeScheduleId: employee?.employeeScheduleId || '',
    },
  });

  const onSubmit = async (data: EmployeeSchema) => {
    if (!employee) return;

    const {
      data: employeeUpdated,
      ok,
      error,
    } = await updateEmployeeAction(employee.id, data);

    if (!ok) {
      showErrorToast(error || 'Erro ao atualizar profissional.');
      return;
    }

    setEmployees((prev) =>
      prev.map((e) => (e.id === employeeId ? employeeUpdated! : e)),
    );

    showSuccessToast('Profissional atualizado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    expedients,
  };
}
