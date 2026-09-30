'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { IAppointment } from '@/src/common/interfaces/appointment';
import { IDashboardMetrics } from '@/src/common/interfaces/barbershop';

import { connectToSocket, disconnectSocket } from '@/src/common/lib/socket';

import getDashboardMetricsAction from '@/app/actions/get-dashboard-metrics';

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
  const queryClient = useQueryClient();
  const { barbershop, setAppointments } = usePanelContext();

  const [dashboardMetrics, setDashboardMetrics] = useState(
    initialDashboardMetrics,
  );

  const socketConnected = useRef(false);
  const handleNewAppointment = useCallback(
    ({ appointment, dashboardMetrics }: NewAppointmentEvent) => {
      setAppointments((prev) => [...prev, appointment]);
      setDashboardMetrics(dashboardMetrics);
    },
    [setAppointments],
  );

  const syncAfterReconnect = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });

    const { data, ok } = await getDashboardMetricsAction();
    if (ok && data) setDashboardMetrics(data);
  }, [queryClient]);

  useEffect(() => {
    if (!token || socketConnected.current) return;

    const socket = connectToSocket(token, apiUrl);
    let hasConnectedBefore = socket.connected;

    const handleConnect = () => {
      if (hasConnectedBefore) syncAfterReconnect();
      hasConnectedBefore = true;
    };

    socket.on('connect', handleConnect);
    socket.on('new-appointment', handleNewAppointment);
    socketConnected.current = true;

    return () => {
      socket.off('connect', handleConnect);
      socket.off('new-appointment', handleNewAppointment);
      disconnectSocket(token, apiUrl);
      socketConnected.current = false;
    };
  }, [token, apiUrl, handleNewAppointment, syncAfterReconnect]);

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
