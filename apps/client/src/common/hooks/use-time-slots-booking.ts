'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

interface IBookingForm {
  employeeId: number;
  date: string;
  time: string;
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

  const employeeId = watch('employeeId');
  const date = watch('date');
  const selectedTime = watch('time');

  const professional = employeesShift.find(
    ({ id }) => id === Number(employeeId),
  );

  const { data: times = [], isFetching: isPending } = useQuery({
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
    refetchOnMount: false,
  });

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
