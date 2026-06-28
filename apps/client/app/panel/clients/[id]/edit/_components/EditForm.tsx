'use client';

import { useRouter } from 'next/navigation';

import updateClientAction from '@/app/actions/update-client';

import { useClientsContext } from '@/src/common/contexts/clients-context';

import { UpdateCustomerSchema } from '@sistema-barbearia/validators';

import { ClientForm } from '../../../_components/ClientForm';

interface IEditFormProps {
  clientId: number;
}

export default function EditForm({ clientId }: IEditFormProps) {
  const { clients, setClients } = useClientsContext();

  const client = clients.find((e) => e.id === clientId);

  const router = useRouter();

  if (!client) {
    return <h1>Cliente não encontrado</h1>;
  }

  async function onSubmit(data: Omit<UpdateCustomerSchema, 'id'>) {
    if (!client) return;

    const userDataFormatted = { ...data, email: data.email || undefined };

    const {
      data: clientUpdated,
      ok,
      error,
    } = await updateClientAction(client.id, userDataFormatted);

    if (!ok) return alert(error);

    setClients((prev) =>
      prev.map((e) => (e.id === client.id ? clientUpdated! : e)),
    );

    router.push('/panel/clients');
  }

  return (
    <ClientForm
      onSubmit={onSubmit}
      submitLabel="Editar"
      defaultValues={{
        name: client.name,
        email: client.email ?? '',
        phone: client.phone,
      }}
    />
  );
}
