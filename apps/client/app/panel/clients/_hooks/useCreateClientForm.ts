'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import createClientAction from '@/app/actions/create-client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

import {
  createCustomerSchema,
  CreateCustomerSchema,
} from '@sistema-barbearia/validators';

interface UseCreateClientFormProps {
  closeDialog: () => void;
}

export function useCreateClientForm({ closeDialog }: UseCreateClientFormProps) {
  const { setClients } = useClientsContext();

  const { register, handleSubmit, formState, control } =
    useForm<CreateCustomerSchema>({
      resolver: zodResolver(createCustomerSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        isBlocked: false,
      },
    });

  async function onSubmit(data: CreateCustomerSchema) {
    const userDataFormatted = { ...data, email: data.email || undefined };

    const {
      data: clientResponse,
      ok,
      error,
    } = await createClientAction(userDataFormatted);

    if (!ok) {
      showErrorToast(error || 'Erro ao criar cliente.');
      return;
    }

    setClients((prev) => [...prev, clientResponse!]);

    showSuccessToast('Cliente criado com sucesso!');
    closeDialog();
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    control,
  };
}
