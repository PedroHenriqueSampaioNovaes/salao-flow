import { Suspense } from 'react';

import { BlockedTimesProvider } from '@/src/common/contexts/blocked-times-context';

import getBlockedTimesAction from '@/app/actions/get-blocked-times';

async function BlockedTimesDataLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: blockedTimes, ok } = await getBlockedTimesAction();

  if (!ok) return <p>Não foi possível buscar os horários bloqueados.</p>;

  return (
    <BlockedTimesProvider blockedTimesData={blockedTimes || []}>
      {children}
    </BlockedTimesProvider>
  );
}

export default async function BlockedTimesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p>Carregando horários bloqueados...</p>}>
      <BlockedTimesDataLoader>{children}</BlockedTimesDataLoader>
    </Suspense>
  );
}
