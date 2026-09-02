'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteExpedientAction from '@/app/actions/delete-expedient';

export function useDeleteExpedient() {
  const { setExpedients } = usePanelContext();
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
    setExpedientToDelete(null);
  };

  return {
    expedientToDelete,
    requestDelete: setExpedientToDelete,
    cancelDelete: () => setExpedientToDelete(null),
    confirmDelete: handleDelete,
  };
}
