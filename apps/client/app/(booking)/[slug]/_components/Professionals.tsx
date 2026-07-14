'use client';

import Image from 'next/image';
import { Check, User, AlertCircle } from 'lucide-react';

import {
  IEmployee,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

import { formatPrice } from '@/src/common/utils/formatPrice';
import { cn } from '@/src/lib/utils';

import { useBookingForm } from './BookingFormContext';

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
  const selectedServiceIds = form.watch('serviceIds') || [];

  const handleEmployeeSelect = (id: number) => {
    if (selectedEmployeeId === id) return;

    form.setValue('serviceIds', []);
    form.setValue('employeeId', id, { shouldValidate: true });
  };

  const handleServiceToggle = (serviceId: string) => {
    let updatedServices = [...selectedServiceIds];
    if (updatedServices.includes(serviceId)) {
      updatedServices = updatedServices.filter((id) => id !== serviceId);
    } else {
      updatedServices.push(serviceId);
    }
    form.setValue('serviceIds', updatedServices, { shouldValidate: true });
  };

  const selectedProfessional = professionals.find(
    (p) => p.id === selectedEmployeeId,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Escolha seu Profissional
        </h2>

        {/* Validation Errors for Employee Selection */}
        {form.formState.errors.employeeId && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{form.formState.errors.employeeId.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {professionals.map((employee) => {
            const { id, name, image } = employee;
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

              if (isToday) return `Hoje às ${firstAvailableSlot}`;
              if (isTomorrow) return `Amanhã às ${firstAvailableSlot}`;

              return `${employeeShiftDate.getUTCDate()}/${employeeShiftDate.getUTCMonth() + 1}/${employeeShiftDate.getUTCFullYear()} às ${firstAvailableSlot}`;
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleEmployeeSelect(id)}
                className={cn(
                  'relative flex flex-col items-center p-5 border border-border/80 rounded-2xl cursor-pointer hover:border-primary/50 bg-card/50 transition-all duration-300 hover:shadow-md text-center',
                  isSelected &&
                    'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02]',
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <Image
                  className="rounded-full shadow-sm mb-3 border border-border/60"
                  width={72}
                  height={72}
                  src={image}
                  alt={name}
                  loading="eager"
                />
                <h3 className="font-bold text-base text-foreground mb-1">
                  {name}
                </h3>
                <p className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                  Próximo horário: {getMessage()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Section */}
      {selectedProfessional && (
        <div className="pt-6 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Selecione os Serviços de {selectedProfessional.name}
          </h2>

          {form.formState.errors.serviceIds && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{form.formState.errors.serviceIds.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {selectedProfessional.services.map(
              ({ id, name, duration, price }) => {
                const isServiceSelected = selectedServiceIds.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleServiceToggle(id)}
                    className={cn(
                      'flex items-center justify-between p-4 border border-border/80 rounded-xl cursor-pointer hover:bg-accent/40 bg-card/40 transition-all duration-200 text-left',
                      isServiceSelected && 'border-primary bg-primary/5',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded border border-input flex items-center justify-center transition-colors',
                          isServiceSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background',
                        )}
                      >
                        {isServiceSelected && (
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          {name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {duration} minutos
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-primary">
                      {formatPrice(price)}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}
