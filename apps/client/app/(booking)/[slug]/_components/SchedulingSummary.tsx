'use client';

import Image from 'next/image';
import { ScissorsIcon, CalendarDays } from 'lucide-react';

import {
  IEmployeeBookingInfo,
  IServices,
} from '@/src/common/interfaces/barbershop-booking';
import { formatPrice } from '@/src/common/utils/formatPrice';

import { useBookingForm } from '../_contexts/BookingFormContext';

interface ISchedulingSummaryProps {
  professionals: IEmployeeBookingInfo[];
}

export default function SchedulingSummary({
  professionals,
}: ISchedulingSummaryProps) {
  const { form } = useBookingForm();

  const employeeId = form.watch('employeeId');
  const serviceIds = form.watch('serviceIds');

  const date = form.watch('date');
  const time = form.watch('time');

  const employee = professionals.find((p) => p.id === employeeId);

  const selectedServices = serviceIds
    .map((id) => employee?.services.find((s) => s.id === id))
    .filter((service): service is IServices => Boolean(service));

  const total = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0,
  );

  const formattedDate = date
    ? `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`
    : '';

  return (
    <div className="bg-appointment-foreground rounded-lg p-4 border border-appointment-border">
      <h3 className="text-xl">Resumo do agendamento</h3>

      <hr className="border-divider-appointment" />

      <div className="flex flex-col gap-4">
        <p className="text-cta-accent text-lg">Profissional:</p>
        <div className="flex items-center gap-2">
          {employee ? (
            <Image
              className="size-9 rounded-lg border border-appointment-border"
              width={36}
              height={36}
              src={employee.image}
              alt="Barbeiro selecionado"
              loading="eager"
            />
          ) : (
            <span className="size-9 rounded-lg border border-appointment-border"></span>
          )}
          <p className="text-sm">{employee?.name || 'Não selecionado'} </p>
        </div>

        <p className="text-cta-accent text-lg">Serviços:</p>
        <div className="flex items-center gap-2">
          <ScissorsIcon className="text-appointment-text-muted" />
          <p className="text-sm">
            {selectedServices.map((service) => service.name).join(', ') ||
              'Não selecionado'}
          </p>
        </div>

        <p className="text-cta-accent text-lg">Data e hora:</p>
        <div className="flex items-center gap-2">
          <CalendarDays className="text-appointment-text-muted" />
          <p className="text-sm">
            {formattedDate && time
              ? `${formattedDate}, às ${time}`
              : formattedDate || 'Não selecionado'}
          </p>
        </div>
      </div>

      <hr className="border-divider-appointment" />

      <div className="flex items-center justify-between">
        <p className="text-lg">Total:</p>
        <p className="text-lg text-cta-accent">{formatPrice(total)}</p>
      </div>
      <p className="text-xs text-right text-appointment-text-muted mt-1">
        Pagamento no local
      </p>
    </div>
  );
}
