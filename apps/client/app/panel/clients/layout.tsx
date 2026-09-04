import { Suspense } from 'react';

import { ClientsProvider } from '@/src/common/contexts/clients-context';

import getClientsAction from '@/app/actions/get-clients';

import LoadingScreen from '@/src/components/ui/loading-screen';

async function ClientsDataLoader({ children }: { children: React.ReactNode }) {
  const { data: clients, ok } = await getClientsAction();

  if (!ok) return <p>Não foi possível buscar os clientes.</p>;

  return (
    <ClientsProvider clientsData={clients || []}>{children}</ClientsProvider>
  );
}

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen message="Buscando clientes..." />}>
      <ClientsDataLoader>{children}</ClientsDataLoader>
    </Suspense>
  );
}
