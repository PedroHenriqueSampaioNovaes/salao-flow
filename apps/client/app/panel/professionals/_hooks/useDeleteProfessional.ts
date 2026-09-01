'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteEmployeeAction from '@/app/actions/delete-employee';

export function useDeleteProfessional() {
  const { setEmployees } = usePanelContext();
  const [professionalToDelete, setProfessionalToDelete] = useState<
    number | null
  >(null);

  const handleDelete = async () => {
    if (!professionalToDelete) return;

    const { ok, error } = await deleteEmployeeAction(professionalToDelete);

    if (!ok) {
      showErrorToast(error);
      setProfessionalToDelete(null);
      return;
    }

    showSuccessToast('Profissional excluído com sucesso!');

    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== professionalToDelete),
    );
    setProfessionalToDelete(null);
  };

  return {
    professionalToDelete,
    requestDelete: setProfessionalToDelete,
    cancelDelete: () => setProfessionalToDelete(null),
    confirmDelete: handleDelete,
  };
}
