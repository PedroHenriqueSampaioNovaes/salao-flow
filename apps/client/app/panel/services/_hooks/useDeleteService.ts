'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteServiceAction from '@/app/actions/delete-service';

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { setServices } = usePanelContext();
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    const { ok, error } = await deleteServiceAction(serviceToDelete);

    if (!ok) {
      showErrorToast(error);
      setServiceToDelete(null);
      return;
    }

    showSuccessToast('Serviço excluído com sucesso!');

    queryClient.invalidateQueries({ queryKey: ['employees'] });
    setServices((prev) =>
      prev.filter((service) => service.id !== serviceToDelete),
    );
    setServiceToDelete(null);
  };

  return {
    serviceToDelete,
    requestDelete: setServiceToDelete,
    cancelDelete: () => setServiceToDelete(null),
    confirmDelete: handleDelete,
  };
}
