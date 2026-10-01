'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { IAppointmentsByDate } from '@/src/common/interfaces/appointment';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import getAppointmentsAction from '@/app/actions/get-appointments';

interface UseAppointmentsListParams {
  employee: number | '';
  selectedDateString: string;
}

export function useAppointmentsList({
  employee = '',
  selectedDateString,
}: UseAppointmentsListParams) {
  const { appointments, setAppointments } = usePanelContext();

  const monthParam = useMemo(() => {
    const selectedDate = new Date(selectedDateString);
    const firstDayOfMonth = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), 1),
    );

    return firstDayOfMonth.toLocaleDateString('en-CA', { timeZone: 'UTC' });
  }, [selectedDateString]);

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
  });

  useEffect(() => {
    if (data) setAppointments(data);
  }, [data, setAppointments]);

  const filteredAppointments = useMemo(
    () => filterAppointments(appointments, employee, selectedDateString),
    [appointments, employee, selectedDateString],
  );

  return {
    filteredAppointments,
    isLoading: isLoading || (isFetching && isError),
    isError,
    refetchAppointments,
  };
}

function filterAppointments(
  appointmentsByDate: IAppointmentsByDate,
  employeeId: number | '',
  selectedDate: string,
) {
  const appointments = appointmentsByDate[selectedDate] || [];

  return appointments?.filter((appointment) => {
    const isSameEmployee = employeeId
      ? appointment.employee.id === employeeId
      : true;
    return isSameEmployee;
  });
}
