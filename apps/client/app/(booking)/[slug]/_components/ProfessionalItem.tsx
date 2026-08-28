'use client';

import Image from 'next/image';
import { Check, Clock } from 'lucide-react';

import {
  IEmployeeBookingInfo,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

import { getNextAvailableSlotMessage } from '@/src/common/utils/getNextAvailableSlotMessage';
import { formatPrice } from '@/src/common/utils/formatPrice';
import { cn } from '@/src/lib/utils';

interface IProfessionalItemProps {
  employee: IEmployeeBookingInfo;
  isSelected: boolean;
  onSelect: (id: number) => void;
  employeesShiftData: IGetAvailableTimeSlotsForBooking['employees'];
  barbershopLocalDateUTC: Date;
}

export default function ProfessionalItem({
  employee,
  isSelected = false,
  onSelect,
  employeesShiftData,
  barbershopLocalDateUTC,
}: IProfessionalItemProps) {
  const { id, name, image, services } = employee;

  const employeeShift = employeesShiftData.find(
    ({ id: employeeId }) => employeeId === employee.id,
  )!;

  const nextSlotMessage = getNextAvailableSlotMessage(
    barbershopLocalDateUTC,
    employeeShift.date,
    employeeShift.availableSlots[0],
  );

  return (
    <div
      className={cn(
        'p-4 rounded-lg border border-appointment-border bg-appointment-card-background',
        isSelected && 'border-cta-accent',
      )}
      onClick={() => onSelect(id)}
    >
      <div className="w-full flex max-sm:flex-col sm:justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Image
            className="rounded-lg border border-appointment-border"
            width={80}
            height={80}
            src={image}
            alt={name}
            loading="eager"
          />
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-xl">{name}</h3>
            <p className="text-sm text-appointment-text-muted leading-none">
              Profissional
            </p>
            <p className="text-xs text-green-600">
              Próximo horário:{' '}
              <strong className="text-green-500">{nextSlotMessage}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(id)}
          className={cn(
            'cursor-pointer flex items-center gap-2 bg-appointment-background border border-cta-accent py-2 px-3 rounded-2xl text-sm text-cta-accent font-bold leading-none',
            isSelected && 'bg-cta-accent text-appointment-background',
          )}
        >
          <Check
            className={cn(
              'size-3.5 text-cta-accent',
              isSelected && 'text-appointment-background',
            )}
          />{' '}
          {isSelected ? 'Selecionado' : 'Selecionar'}
        </button>
      </div>

      <p className="pt-4 pb-3 text-appointment-text-muted text-sm font-bold uppercase">
        Serviços deste profissional:
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <li
            key={service.id}
            className="text-white text-sm text-bold bg-appointment-foreground rounded-lg px-3 py-2 flex flex-col gap-2.5"
          >
            <span className="truncate">{service.name}</span>
            <div className="flex items-center justify-between gap-1">
              <span className="text-appointment-text-muted flex items-center gap-2">
                <Clock className="size-3" />
                {service.duration} min
              </span>
              <span className="font-bold text-cta-accent">
                {formatPrice(service.price)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
