'use client';

import { Dispatch, SetStateAction, useMemo } from 'react';

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

interface IUseDaysNavigationParams {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
}

export function useDaysNavigation({
  selectedDate,
  setSelectedDate,
}: IUseDaysNavigationParams) {
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
            selectedDate.getUTCFullYear(),
            selectedDate.getUTCMonth(),
            selectedDate.getUTCDate() + offset,
          ),
        );

        return {
          date: dayDate,
          dayName: getDayName(dayDate),
          dayNum: dayDate.getUTCDate(),
          isSelected: selectedDate.getTime() === dayDate.getTime(),
          isMatchDate:
            today.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) ===
            dayDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
        };
      }),
    [selectedDate, today],
  );

  const moveDay = (delta: number) => {
    setSelectedDate((current) => {
      return new Date(
        Date.UTC(
          current.getUTCFullYear(),
          current.getUTCMonth(),
          current.getUTCDate() + delta,
        ),
      );
    });
  };

  const selectDay = (dayDate: Date) => setSelectedDate(dayDate);

  return {
    days,
    moveDay,
    selectDay,
  };
}
