'use client';

import { useState } from 'react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteBlockedTimesAction from '@/app/actions/delete-blocked-times';

export function useDeleteBlockedTime() {
  const { setBlockedTimes } = usePanelContext();
  const [blockedTimeToDelete, setBlockedTimeToDelete] = useState<string | null>(
    null,
  );

  const handleDelete = async () => {
    if (!blockedTimeToDelete) return;

    const { ok, error } = await deleteBlockedTimesAction(blockedTimeToDelete);

    if (!ok) {
      showErrorToast(error);
      setBlockedTimeToDelete(null);
      return;
    }

    showSuccessToast('Bloqueio de horário excluído com sucesso!');

    setBlockedTimes((prev) =>
      prev.filter((blockedTime) => blockedTime.id !== blockedTimeToDelete),
    );
    setBlockedTimeToDelete(null);
  };

  return {
    blockedTimeToDelete,
    requestDelete: setBlockedTimeToDelete,
    cancelDelete: () => setBlockedTimeToDelete(null),
    confirmDelete: handleDelete,
  };
}
