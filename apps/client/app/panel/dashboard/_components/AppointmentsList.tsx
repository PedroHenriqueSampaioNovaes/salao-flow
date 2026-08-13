'use client';

import {
  CircleDollarSign,
  Phone,
  Scissors,
  CalendarX,
  IdCardLanyard,
} from 'lucide-react';

import { formatPrice } from '@/src/common/utils/formatPrice';

import { IAppointment } from '@/src/common/interfaces/appointment';

interface AppointmentsListProps {
  appointments: IAppointment[];
}

export default function AppointmentsList({
  appointments,
}: AppointmentsListProps) {
  return (
    <div className="flex flex-col border-t border-border/20 leading-none divide-y divide-border/20">
      {appointments.length === 0 ? (
        <div className="p-4 md:p-6 flex max-sm:flex-col items-center justify-center gap-2 text-secondary">
          <CalendarX className="shrink-0" />
          <span className="mt-1 text-center">
            Nenhum agendamento para este dia.
          </span>
        </div>
      ) : (
        appointments.map(
          ({ id, services, employee: appEmp, customer }, index) => {
            const startTime = index === 0 ? '17:00' : '17:30';
            const endTime = index === 0 ? '17:30' : '18:00';
            const totalPrice = services.reduce((acc, s) => acc + s.price, 0);
            const formattedPriceStr = formatPrice(
              totalPrice < 100 ? totalPrice * 100 : totalPrice,
            );
            const serviceNames =
              services.map((s) => s.name).join(', ') ||
              'Corte + Barba, Barba Terapia';
            const customerName = customer?.name || 'Pedro Henrique';
            const customerPhone = customer?.phone || '(11) 91111-1111';

            return (
              <div key={id} className="p-4 md:p-6 flex gap-4">
                {/* Time Slot Column */}
                <div className="flex flex-col items-center justify-center font-bold max-sm:text-sm">
                  <span>{startTime}</span>
                  <div className="w-0.5 h-5 bg-black my-1" />
                  <span>{endTime}</span>
                </div>

                {/* Appointment Details Column */}
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-bold max-sm:text-sm truncate">
                    {customerName}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Phone className="size-3.5 text-gray-400 shrink-0" />
                    <span>{customerPhone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <Scissors className="size-3.5 text-gray-400 shrink-0" />
                    <span>{serviceNames}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <IdCardLanyard className="size-3.5 text-gray-400 shrink-0" />
                    <span>{appEmp?.name || 'Carlos Cabeleireiro'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <CircleDollarSign className="size-3.5 text-gray-400 shrink-0" />
                    <span>{formattedPriceStr}</span>
                  </div>
                </div>
              </div>
            );
          },
        )
      )}
    </div>
  );
}
