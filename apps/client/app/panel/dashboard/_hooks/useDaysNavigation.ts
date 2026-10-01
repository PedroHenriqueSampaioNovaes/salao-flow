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
  selectedDateString: string;
  setSelectedDateString: Dispatch<SetStateAction<string>>;
}

export function useDaysNavigation({
  selectedDateString,
  setSelectedDateString,
}: IUseDaysNavigationParams) {
  const { barbershop } = usePanelContext();

  const today = getLocalDateAsUTCDate(
    barbershop.instantLocalTime,
    barbershop.timezone,
  );

  const days = useMemo(
    () =>
      [-2, -1, 0, 1, 2].map((offset) => {
        const selectedDate = new Date(selectedDateString);
        const dayDate = new Date(selectedDate);
        dayDate.setUTCDate(dayDate.getUTCDate() + offset);

        const dayDateString = dayDate.toLocaleDateString('en-CA', {
          timeZone: 'UTC',
        });

        return {
          date: dayDateString,
          dayName: getDayName(dayDate),
          dayNum: dayDate.getUTCDate(),
          isSelected: selectedDateString === dayDateString,
          isMatchDate:
            today.toLocaleDateString('en-CA', { timeZone: 'UTC' }) ===
            dayDateString,
        };
      }),
    [selectedDateString, today],
  );

  const moveDay = (delta: number) => {
    setSelectedDateString((currentDateString) => {
      const currentDate = new Date(currentDateString);
      return new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate() + delta,
      ).toLocaleDateString('en-CA', { timeZone: 'UTC' });
    });
  };

  const selectDay = (dateString: string) => setSelectedDateString(dateString);

  return {
    days,
    moveDay,
    selectDay,
  };
}
