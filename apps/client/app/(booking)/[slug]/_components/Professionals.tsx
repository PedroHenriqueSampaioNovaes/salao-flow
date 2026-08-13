'use client';

import Image from 'next/image';
import { Check, User, AlertCircle, Clock } from 'lucide-react';

import {
  IEmployee,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

import { formatPrice } from '@/src/common/utils/formatPrice';
import { cn } from '@/src/lib/utils';

import { useBookingForm } from '../_contexts/BookingFormContext';

import StepTitle from './StepTitle';

interface IProfessionalsProps {
  professionals: IEmployee[];
  barbershopLocalDateUTC: Date;
  employeesShiftData: IGetAvailableTimeSlotsForBooking['employees'];
}

export default function Professionals({
  professionals,
  barbershopLocalDateUTC,
  employeesShiftData,
}: IProfessionalsProps) {
  const { form } = useBookingForm();
  const selectedEmployeeId = form.watch('employeeId');

  const handleEmployeeSelect = (id: number) => {
    if (selectedEmployeeId === id) return;

    form.setValue('serviceIds', []);
    form.setValue('employeeId', id, { shouldValidate: true });
    form.setValue('date', '');
    form.setValue('time', '');
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <StepTitle title="Escolha seu Profissional" icon={User} />

      {form.formState.errors.employeeId && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{form.formState.errors.employeeId.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {professionals.map((employee) => {
          const { id, name, image, services } = employee;
          const isSelected = selectedEmployeeId === id;
          const employeeShift = employeesShiftData.find(
            ({ id: employeeId }) => employeeId === id,
          );
          if (!employeeShift) {
            return (
              <div
                key={id}
                className="p-4 border border-border rounded-xl bg-muted/40"
              >
                <p className="text-sm text-muted-foreground">
                  Profissional indisponível no momento.
                </p>
              </div>
            );
          }
          const firstAvailableSlot = employeeShift.availableSlots[0];
          const employeeShiftDate = new Date(employeeShift.date);
          function getMessage() {
            if (!firstAvailableSlot) {
              return 'Sem horários nos próximos 10 dias';
            }
            const isToday =
              barbershopLocalDateUTC.getUTCDate() ===
                employeeShiftDate.getUTCDate() &&
              barbershopLocalDateUTC.getUTCMonth() ===
                employeeShiftDate.getUTCMonth();
            const tomorrow = new Date(
              barbershopLocalDateUTC.getTime() + 24 * 60 * 60 * 1000,
            );
            const isTomorrow =
              employeeShiftDate.getUTCDate() === tomorrow.getUTCDate() &&
              employeeShiftDate.getUTCMonth() === tomorrow.getUTCMonth();
            if (isToday) return `Hoje, às ${firstAvailableSlot}`;
            if (isTomorrow) return `Amanhã, às ${firstAvailableSlot}`;
            return `${String(employeeShiftDate.getUTCDate()).padStart(2, '0')}/${String(employeeShiftDate.getUTCMonth() + 1).padStart(2, '0')}/${employeeShiftDate.getUTCFullYear()}, às ${firstAvailableSlot}`;
          }
          return (
            <div
              key={id}
              className={cn(
                'p-4 rounded-lg border border-appointment-border bg-appointment-card-background',
                isSelected && 'border-cta-accent',
              )}
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
                      <strong className="text-green-500">{getMessage()}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleEmployeeSelect(id)}
                  className={cn(
                    'cursor-pointer flex items-center gap-2 bg-neutral/20 border border-appointment-border py-2 px-3 rounded-2xl text-sm text-appointment-text-muted font-bold leading-none',
                    isSelected &&
                      'border-cta-accent bg-cta-accent text-appointment-background',
                  )}
                >
                  <Check
                    className={cn(
                      'size-3.5 text-border',
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
        })}
      </div>
    </div>
  );
}
