'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createCustomerSchema,
  CreateCustomerSchema,
} from '@sistema-barbearia/validators';

import updateClientAction from '@/app/actions/update-client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

interface UseEditClientFormProps {
  clientId: number;
  closeDialog: () => void;
}

export function useEditClientForm({
  clientId,
  closeDialog,
}: UseEditClientFormProps) {
  const { clients, setClients } = useClientsContext();

  const client = clients.find((c) => c.id === clientId);

  const { register, handleSubmit, formState, control } =
    useForm<CreateCustomerSchema>({
      resolver: zodResolver(createCustomerSchema),
      defaultValues: {
        name: client?.name || '',
        phone: client?.phone || '',
        email: client?.email || '',
        isBlocked: client?.isBlocked || false,
      },
    });

  const onSubmit: SubmitHandler<CreateCustomerSchema> = async (data) => {
    if (!client) return;

    const userDataFormatted = { ...data, email: data.email || undefined };

    const {
      data: clientUpdated,
      ok,
      error,
    } = await updateClientAction(client.id, userDataFormatted);

    if (!ok) {
      showErrorToast(error || 'Erro ao atualizar cliente.');
      return;
    }

    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? clientUpdated! : c)),
    );

    showSuccessToast('Cliente atualizado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    control,
  };
}
