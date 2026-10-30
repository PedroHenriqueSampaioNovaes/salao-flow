'use client';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export function useDashboardMetrics() {
  const { barbershop } = usePanelContext();

  const today = getLocalDateAsUTCDate(
    barbershop.instantLocalTime,
    barbershop.timezone,
  );

  const currentDateFormatted = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(today);

  return {
    barbershop,
    currentDateFormatted:
      currentDateFormatted[0].toUpperCase() + currentDateFormatted.slice(1),
  };
}
