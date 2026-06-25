import { Suspense } from 'react';

import { ExpedientsProvider } from '@/src/common/contexts/expedients-context';

import getExpedientsAction from '@/app/actions/get-expedients';

async function ExpedientsDataLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: expedients, ok } = await getExpedientsAction();

  if (!ok) return <p>Não foi possível buscar os expedientes.</p>;

  return (
    <ExpedientsProvider expedientsData={expedients || []}>
      {children}
    </ExpedientsProvider>
  );
}

export default async function ExpedientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ExpedientsDataLoader>{children}</ExpedientsDataLoader>
    </Suspense>
  );
}
