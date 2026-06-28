'use client';

import { useRouter } from 'next/navigation';

import createClientAction from '@/app/actions/create-client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import { CreateCustomerSchema } from '@sistema-barbearia/validators';

import { ClientForm } from '../../_components/ClientForm';

export default function NewForm() {
  const router = useRouter();

  const { setClients } = useClientsContext();

  async function onSubmit(data: CreateCustomerSchema) {
    const userDataFormatted = { ...data, email: data.email || undefined };

    const {
      data: clientResponse,
      ok,
      error,
    } = await createClientAction(userDataFormatted);

    if (!ok) return alert(error);

    setClients((prev) => [...prev, { ...clientResponse!, isBlocked: false }]);
    router.push('/panel/clients');
  }

  return <ClientForm onSubmit={onSubmit} />;
}
