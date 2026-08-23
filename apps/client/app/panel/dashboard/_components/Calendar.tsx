'use client';

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

import { usePanelContext } from '@/src/common/contexts/panel-context';
import { useSelectedDateContext } from '@/src/common/contexts/selected-date-context';

import { IAppointment } from '@/src/common/interfaces/appointment';

import ActionControls from './ActionControls';
import AppointmentsList from './AppointmentsList';
import DaysNavigationBar from './DaysNavigationBar';

const dateRibbonFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function Calendar() {
  const { appointments } = usePanelContext();
  const { date } = useSelectedDateContext();

  const [employee, setEmployee] = useState<number | ''>('');

  const displayAppointments: IAppointment[] =
    appointments.length > 0
      ? filterAppointments(appointments, employee, date)
      : [
          {
            id: '1',
            date: '2026-07-13T17:00:00.000Z',
            customer: {
              id: 101,
              name: 'Pedro Henrique',
              phone: '(11) 91111-1111',
            },
            employee: { id: 1, name: 'Carlos Cabeleireiro' },
            services: [{ name: 'Corte + Barba, Barba Terapia', price: 3000 }],
          },
          {
            id: '2',
            date: '2026-07-23T17:30:00.000Z',
            customer: {
              id: 102,
              name: 'Pedro Henrique',
              phone: '(11) 91111-1111',
            },
            employee: { id: 1, name: 'Carlos Cabeleireiro' },
            services: [{ name: 'Corte + Barba, Barba Terapia', price: 3000 }],
          },
        ];

  return (
    <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-hidden flex flex-col">
      <div className="p-4 md:px-6 flex items-center gap-2 border-b border-neutral/20">
        <div className="p-2 rounded-full bg-foreground flex items-center justify-center shrink-0">
          <CalendarCheck className="size-6 text-brand-accent" />
        </div>
        <h2 className="text-lg font-bold leading-none">Agenda</h2>
      </div>

      <DaysNavigationBar />

      <div className="bg-[#F8F9FA] border-t border-b border-border/20 py-2 text-center font-medium text-primary">
        {dateRibbonFormatter.format(date)}
      </div>

      <ActionControls
        employee={employee}
        onEmployeeChange={setEmployee}
      />

      <AppointmentsList appointments={displayAppointments} />
    </div>
  );
}

function filterAppointments(
  appointments: IAppointment[],
  employeeId: number | '',
  date: Date,
) {
  return appointments?.filter(({ date: appointmentDate, employee }) => {
    const appointment = new Date(appointmentDate);
    const isSameDate = appointment.toDateString() === date.toDateString();
    const isSameEmployee = employeeId ? employee.id === employeeId : true;

    return isSameDate && isSameEmployee;
  });
}
