'use client';

import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import { timeToMinutes } from '@/src/common/utils/timeToMinutes';
import { getWeekdayFromDateString } from '@/src/common/utils/getWeekdayFromDateString';

interface IBookingForm {
  employeeId: number;
  date: string;
  time: string;
  serviceIds: string[];
}

export interface IServiceDuration {
  id: string;
  duration: number;
}

export interface IWeekdaySchedule {
  weekday: number;
  isWorkingDay: boolean;
  start?: string | null;
  startLunch?: string | null;
  endLunch?: string | null;
  end?: string | null;
}

interface IUseTimeSlotsBookingParams {
  slug: string;
  employeesShift: IGetAvailableTimeSlotsForBooking['employees'];
  employeeSchedule?: IWeekdaySchedule[];
  services?: IServiceDuration[];
}

function filterSlotsByServicesDuration(
  slots: string[],
  weekdaySchedule: IWeekdaySchedule | undefined,
  totalServicesDuration: number,
) {
  if (!weekdaySchedule?.isWorkingDay || totalServicesDuration <= 0) {
    return slots;
  }

  const { start, startLunch, endLunch, end } = weekdaySchedule;
  if (!start || !end) return slots;

  const shiftStart = timeToMinutes(start);
  const shiftEnd = timeToMinutes(end);
  const lunchStart = startLunch ? timeToMinutes(startLunch) : null;
  const lunchEnd = endLunch ? timeToMinutes(endLunch) : null;

  return slots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + totalServicesDuration;

    if (slotStart < shiftStart || slotEnd > shiftEnd) return false;

    if (lunchStart !== null && lunchEnd !== null) {
      const overlapsLunch = slotStart < lunchEnd && slotEnd > lunchStart;
      if (overlapsLunch) return false;
    }

    return true;
  });
}

export function useTimeSlotsBooking({
  slug,
  employeesShift,
  employeeSchedule,
  services = [],
}: IUseTimeSlotsBookingParams) {
  const { watch, setValue } = useFormContext<IBookingForm>();

  const employeeId = watch('employeeId');
  const date = watch('date');
  const selectedTime = watch('time');
  const servicesIds = watch('serviceIds');

  const professional = employeesShift.find(
    ({ id }) => id === Number(employeeId),
  );

  const { data: rawTimes = [], isFetching: isPending } = useQuery({
    queryKey: ['time-slots', slug, professional?.id, date],
    queryFn: async () => {
      const { data, ok } = await getAvailableTimeSlotsForBookingAction({
        slug,
        dateString: date,
        employeeId: professional!.id,
        lookForNextAvailableTimeSlot: 0,
      });

      if (!ok || !data.employees[0]) {
        throw new Error('Falhou a busca pelos horários disponíveis');
      }

      return data.employees[0].availableSlots;
    },
    staleTime: 0,
  });

  const totalServicesDuration = useMemo(() => {
    const selectedServiceIds = servicesIds ?? [];

    return services
      .filter((service) => selectedServiceIds.includes(service.id))
      .reduce((total, service) => total + service.duration, 0);
  }, [services, servicesIds]);

  const times = useMemo(() => {
    if (!date) return rawTimes;

    const weekday = getWeekdayFromDateString(date);
    const weekdaySchedule = employeeSchedule?.find(
      (schedule) => schedule.weekday === weekday,
    );

    return filterSlotsByServicesDuration(
      rawTimes,
      weekdaySchedule,
      totalServicesDuration,
    );
  }, [rawTimes, date, employeeSchedule, totalServicesDuration]);

  const handleSelectTimeSlot = useCallback(
    (time: string) => {
      setValue('time', time, { shouldValidate: true });
    },
    [setValue],
  );

  return {
    times,
    selectedTime,
    isPending,
    handleSelectTimeSlot,
  };
}
