'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IAppointment } from '@/src/common/interfaces/appointment';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import getAppointmentsAction from '@/app/actions/get-appointments';

interface UseAppointmentsListParams {
  employee: number | '';
  selectedDate: Date;
  barbershopTimezone: string;
}

export function useAppointmentsList({
  employee = '',
  selectedDate,
  barbershopTimezone,
}: UseAppointmentsListParams) {
  const { appointments, setAppointments } = usePanelContext();

  const monthParam = useMemo(() => {
    const firstDayOfMonth = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1),
    );

    return firstDayOfMonth.toLocaleDateString('en-CA', { timeZone: 'UTC' });
  }, [selectedDate]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ['appointments', monthParam],
    queryFn: async () => {
      const { data, ok, error } = await getAppointmentsAction({
        dateString: monthParam,
      });

      if (!ok) {
        throw new Error(error);
      }

      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) setAppointments(data);
  }, [data, setAppointments]);

  const filteredAppointments = useMemo(
    () =>
      filterAppointments(
        appointments ?? [],
        employee,
        selectedDate,
        barbershopTimezone,
      ),
    [appointments, employee, selectedDate, barbershopTimezone],
  );

  return {
    filteredAppointments,
    isLoading: isLoading || (isFetching && isError),
    isError,
    refetchAppointments,
  };
}

function filterAppointments(
  appointments: IAppointment[],
  employeeId: number | '',
  selectedDate: Date,
  timezone: string,
) {
  return appointments?.filter(({ date: appointmentDate, employee }) => {
    const appointment = new Date(appointmentDate);
    const isSameDate =
      appointment.toLocaleDateString('pt-BR', { timeZone: timezone }) ===
      selectedDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const isSameEmployee = employeeId ? employee.id === employeeId : true;

    return isSameDate && isSameEmployee;
  });
}
