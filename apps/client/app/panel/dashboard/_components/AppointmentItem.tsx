'use client';

import { CircleDollarSign, Phone, Scissors, IdCardLanyard } from 'lucide-react';

import { formatPrice } from '@/src/common/utils/formatPrice';
import {
  addMinutes,
  formatAppointmentTime,
} from '@/src/common/utils/appointmentTime';

import { IAppointment } from '@/src/common/interfaces/appointment';

interface AppointmentItemProps {
  appointment: IAppointment;
  timezone: string;
}

export default function AppointmentItem({
  appointment,
  timezone,
}: AppointmentItemProps) {
  const {
    id,
    services,
    employee,
    customer,
    date: appointmentDate,
    totalServiceDuration,
  } = appointment;

  const startTime = formatAppointmentTime(appointmentDate, timezone);
  const endTime = formatAppointmentTime(
    addMinutes(appointmentDate, totalServiceDuration),
    timezone,
  );
  const totalPrice = services.reduce((acc, s) => acc + s.price, 0);
  const formattedPriceStr = formatPrice(
    totalPrice < 100 ? totalPrice * 100 : totalPrice,
  );
  const serviceNames = services.map((s) => s.name).join(', ');

  return (
    <div key={id} className="p-4 md:p-6 flex gap-4">
      <div className="flex flex-col items-center justify-center font-bold max-sm:text-sm">
        <span>{startTime}</span>
        <div className="w-0.5 h-5 bg-black my-1" />
        <span>{endTime}</span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold max-sm:text-sm truncate">{customer?.name}</h3>

        <div className="grid sm:grid-cols-[12rem_10rem] gap-1">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Phone className="size-3.5 text-gray-400 shrink-0" />
            <span>{customer?.phone}</span>
          </div>

          <div className="row-start-2 flex items-center gap-2 text-xs text-secondary">
            <Scissors className="size-3.5 text-gray-400 shrink-0" />
            <span>{serviceNames}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary">
            <IdCardLanyard className="size-3.5 text-gray-400 shrink-0" />
            <span>{employee?.name}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-secondary">
            <CircleDollarSign className="size-3.5 text-gray-400 shrink-0" />
            <span>{formattedPriceStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
