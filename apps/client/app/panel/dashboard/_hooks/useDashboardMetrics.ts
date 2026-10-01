'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { IAppointment } from '@/src/common/interfaces/appointment';
import { IDashboardMetrics } from '@/src/common/interfaces/barbershop';

import { connectToSocket, disconnectSocket } from '@/src/common/lib/socket';

interface NewAppointmentEvent {
  appointment: IAppointment;
  dashboardMetrics: IDashboardMetrics;
}

interface IUseDashboardMetricsParams {
  token: string;
  apiUrl: string;
  initialDashboardMetrics: IDashboardMetrics;
}

export function useDashboardMetrics({
  token,
  apiUrl,
  initialDashboardMetrics,
}: IUseDashboardMetricsParams) {
  const { barbershop, setAppointments } = usePanelContext();

  const [dashboardMetrics, setDashboardMetrics] = useState(
    initialDashboardMetrics,
  );

  const socketConnected = useRef(false);
  const handleNewAppointment = useCallback(
    ({ appointment, dashboardMetrics }: NewAppointmentEvent) => {
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
      setDashboardMetrics(dashboardMetrics);
    },
    [setAppointments],
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
    dashboardMetrics,
    currentDateFormatted:
      currentDateFormatted[0].toUpperCase() + currentDateFormatted.slice(1),
  };
}
