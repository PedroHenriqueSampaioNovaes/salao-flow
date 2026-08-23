'use client';

import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

import { usePanelContext } from '@/src/common/contexts/panel-context';

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
  const { barbershop } = usePanelContext();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = getLocalDateAsUTCDate(
      barbershop.instantLocalTime,
      barbershop.timezone,
    );

    const initialDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    return initialDate;
  });

  const [employee, setEmployee] = useState<number | ''>('');

  return (
    <div className="bg-white rounded-2xl shadow shadow-neutral/20 overflow-hidden flex flex-col">
      <div className="p-4 md:px-6 flex items-center gap-2 border-b border-neutral/20">
        <div className="p-2 rounded-full bg-foreground flex items-center justify-center shrink-0">
          <CalendarCheck className="size-6 text-brand-accent" />
        </div>
        <h2 className="text-lg font-bold leading-none">Agenda</h2>
      </div>

      <DaysNavigationBar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className="bg-[#F8F9FA] border-t border-b border-border/20 py-2 text-center font-medium text-primary">
        {dateRibbonFormatter.format(selectedDate)}
      </div>

      <ActionControls employee={employee} onEmployeeChange={setEmployee} />

      <AppointmentsList
        employee={employee}
        selectedDate={selectedDate}
      />
    </div>
  );
}
