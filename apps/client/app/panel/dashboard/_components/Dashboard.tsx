'use client';

import { useCallback, useEffect, useRef } from 'react';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { IAppointment } from '@/src/common/interfaces/appointment';
import { IDashboardMetrics } from '@/src/common/interfaces/barbershop';

import { connectToSocket, disconnectSocket } from '@/src/common/lib/socket';

import MetricCards from './MetricCards';
import Calendar from './Calendar';
import BookingLink from './BookingLink';

interface DashboardProps {
  token: string;
  apiUrl: string;
  dashboardMetrics: IDashboardMetrics;
}

export default function Dashboard({
  token,
  apiUrl,
  dashboardMetrics,
}: DashboardProps) {
  const { barbershop, setAppointments } = usePanelContext();

  const socketConnected = useRef(false);
  const handleNewAppointment = useCallback(
    (newAppointment: IAppointment) => {
      setAppointments((prev) => [...prev, newAppointment]);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Bem-vindo à {barbershop?.name}!
        </h1>
        <p className="text-sm text-primary mt-1 font-normal">
          {currentDateFormatted[0].toUpperCase() +
            currentDateFormatted.slice(1)}
        </p>
      </div>

      <MetricCards dashboardMetrics={dashboardMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] gap-5 items-start">
        <Calendar />
        <BookingLink />
      </div>
    </div>
  );
}
