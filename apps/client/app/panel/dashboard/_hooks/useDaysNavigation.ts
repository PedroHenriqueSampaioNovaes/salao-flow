'use client';

import { useMemo } from 'react';

import { useSelectedDateContext } from '@/src/common/contexts/selected-date-context';
import { usePanelContext } from '@/src/common/contexts/panel-context';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

const dayNameFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  timeZone: 'UTC',
});

function getDayName(date: Date): string {
  return dayNameFormatter
    .format(date)
    .replace('.', '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

export function useDaysNavigation() {
  const { date, setDate } = useSelectedDateContext();
  const { barbershop } = usePanelContext();

  const today = getLocalDateAsUTCDate(
    barbershop.instantLocalTime,
    barbershop.timezone,
  );

  const days = useMemo(
    () =>
      [-2, -1, 0, 1, 2].map((offset) => {
        const dayDate = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + offset,
          ),
        );

        return {
          date: dayDate,
          dayName: getDayName(dayDate),
          dayNum: dayDate.getUTCDate(),
          isSelected: date.getTime() === dayDate.getTime(),
          isMatchDate:
            today.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) ===
            dayDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        };
      }),
    [date, today],
  );

  const moveDay = (delta: number) => {
    setDate((current) => {
      return new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate() + delta,
        ),
      );
    });
  };

  const selectDay = (dayDate: Date) => setDate(dayDate);

  return {
    days,
    moveDay,
    selectDay,
  };
}
