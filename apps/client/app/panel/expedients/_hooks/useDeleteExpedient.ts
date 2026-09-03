'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteExpedientAction from '@/app/actions/delete-expedient';

export function useDeleteExpedient() {
  const { setEmployees, setExpedients, expedients } = usePanelContext();
  const [expedientToDelete, setExpedientToDelete] = useState<string | null>(
    null,
  );

  const handleDelete = async () => {
    if (!expedientToDelete) return;

    const { ok, error } = await deleteExpedientAction(expedientToDelete);

    if (!ok) {
      showErrorToast(error);
      setExpedientToDelete(null);
      return;
    }

    showSuccessToast('Expediente excluído com sucesso!');

    setExpedients((prev) =>
      prev.filter((expedient) => expedient.id !== expedientToDelete),
    );

    const defaultExpedient = expedients.find(
      (expedient) => expedient.isDefault,
    )!;

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.employeeScheduleId === expedientToDelete
          ? { ...employee, employeeScheduleId: defaultExpedient.id }
          : employee,
      ),
    );
    setExpedientToDelete(null);
  };

  return {
    expedientToDelete,
    requestDelete: setExpedientToDelete,
    cancelDelete: () => setExpedientToDelete(null),
    confirmDelete: handleDelete,
  };
}
