'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { IAppointment } from '@/src/common/interfaces/appointment';

import { connectToSocket, disconnectSocket } from '@/src/common/lib/socket';

import { DASHBOARD_METRICS_QUERY_KEY } from '../_components/MetricCards';

interface IUseDashboardMetricsParams {
  token: string;
  apiUrl: string;
}

export function useDashboardMetrics({
  token,
  apiUrl,
}: IUseDashboardMetricsParams) {
  const { barbershop, setAppointments } = usePanelContext();
  const queryClient = useQueryClient();

  const socketConnected = useRef(false);
  const handleNewAppointment = useCallback(
    (appointment: IAppointment) => {
      setAppointments((prev) => {
        const appointmentDate = new Date(appointment.date).toLocaleDateString(
          'en-CA',
          { timeZone: 'UTC' },
        );
        const appointmentsOfTheDay = prev[appointmentDate] || [];
        const ordenedAppointments = [...appointmentsOfTheDay, appointment].sort(
          (a, b) => a.date.localeCompare(b.date),
        );

        return {
          ...prev,
          [appointmentDate]: ordenedAppointments,
        };
      });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_METRICS_QUERY_KEY });
    },
    [setAppointments, queryClient],
  );

  useEffect(() => {
    if (!token || socketConnected.current) return;

    const socket = connectToSocket(token, apiUrl);
    socket.on('new-appointment', handleNewAppointment);
    socketConnected.current = true;

    return () => {
      socket.off('new-appointment', handleNewAppointment);
      disconnectSocket(token, apiUrl);
      socketConnected.current = false;
    };
  }, [token, apiUrl, handleNewAppointment]);

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
