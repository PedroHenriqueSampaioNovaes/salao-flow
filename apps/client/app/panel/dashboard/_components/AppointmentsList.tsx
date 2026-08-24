'use client';

import { CalendarX, Loader2 } from 'lucide-react';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { useAppointmentsList } from '../_hooks/useAppointmentsList';

import AppointmentItem from './AppointmentItem';

interface AppointmentsListProps {
  employee: number | '';
  selectedDate: Date;
}

export default function AppointmentsList({
  employee,
  selectedDate,
}: AppointmentsListProps) {
  const { barbershop } = usePanelContext();
  const { filteredAppointments, isFetching, isError, refetchAppointments } =
    useAppointmentsList({
      employee,
      selectedDate,
      barbershopTimezone: barbershop.timezone,
    });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 md:p-6 text-secondary">
        <Loader2 className="size-4 animate-spin shrink-0" />
        <span>Carregando agendamentos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 md:p-6 text-secondary">
        <CalendarX className="shrink-0" />
        <span>
          Erro ao carregar os agendamentos.{' '}
          <button
            onClick={() => refetchAppointments()}
            className="text-brand-accent hover:underline cursor-pointer"
          >
            Tentar novamente.
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col leading-none divide-y divide-border/20 max-h-81.25 overflow-y-auto">
      {filteredAppointments.length === 0 ? (
        <div className="p-4 md:p-6 flex max-sm:flex-col items-center justify-center gap-2 text-secondary">
          <CalendarX className="shrink-0" />
          <span className="mt-1 text-center">
            Nenhum agendamento para este dia.
          </span>
        </div>
      ) : (
        filteredAppointments.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            timezone={barbershop.timezone}
          />
        ))
      )}
    </div>
  );
}
