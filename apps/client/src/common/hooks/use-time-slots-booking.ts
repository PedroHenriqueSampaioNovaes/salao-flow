'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

interface IBookingForm {
  employeeId: number;
  date: string;
  time: string;
}

interface ITimeSlotsCache {
  professionalId: number;
  date: string;
  slots: string[];
}

interface IUseTimeSlotsBookingParams {
  slug: string;
  employeesShift: IGetAvailableTimeSlotsForBooking['employees'];
}

export function useTimeSlotsBooking({
  slug,
  employeesShift,
}: IUseTimeSlotsBookingParams) {
  const { watch, setValue } = useFormContext<IBookingForm>();
  const [isPending, startTransition] = useTransition();

  const employeeId = watch('employeeId');
  const date = watch('date');
  const selectedTime = watch('time');

  const professional = employeesShift.find(
    ({ id }) => id === Number(employeeId),
  );

  const [fetchedSlots, setFetchedSlots] = useState<ITimeSlotsCache | null>(
    null,
  );

  const isInitialDate = professional?.date === date;
  const hasCachedData =
    fetchedSlots?.professionalId === professional?.id &&
    fetchedSlots?.date === date;

  const resolveTimeSlots = useCallback(() => {
    if (!professional) return [];
    if (hasCachedData) return fetchedSlots!.slots;
    if (isInitialDate) return professional.availableSlots ?? [];
    return [];
  }, [professional, hasCachedData, fetchedSlots, isInitialDate]);

  const times = resolveTimeSlots();

  useEffect(() => {
    if (!professional || !date || isInitialDate || hasCachedData) return;

    startTransition(() => {
      const fetchTimeSlots = async () => {
        const { data, ok } = await getAvailableTimeSlotsForBookingAction({
          slug,
          dateString: date,
          employeeId: professional.id,
          lookForNextAvailableTimeSlot: 0,
        });

        if (ok && data.employees[0]) {
          setFetchedSlots({
            professionalId: professional.id,
            date,
            slots: data.employees[0].availableSlots,
          });
        }
      };
      fetchTimeSlots();
    });
  }, [professional, date, slug, isInitialDate, hasCachedData]);

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
