'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import deleteClientAction from '@/app/actions/delete-client';

import { DASHBOARD_METRICS_QUERY_KEY } from '../../dashboard/_components/MetricCards';

export function useDeleteClient() {
  const { setClients } = useClientsContext();
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!clientToDelete) return;

    const { ok, error } = await deleteClientAction(clientToDelete);

    if (!ok) {
      showErrorToast(error);
      setClientToDelete(null);
      return;
    }

    showSuccessToast('Cliente excluído com sucesso!');

    setClients((prev) => prev.filter((client) => client.id !== clientToDelete));
    setClientToDelete(null);
    queryClient.invalidateQueries({ queryKey: DASHBOARD_METRICS_QUERY_KEY });
  };

  return {
    clientToDelete,
    requestDelete: setClientToDelete,
    cancelDelete: () => setClientToDelete(null),
    confirmDelete: handleDelete,
  };
}
