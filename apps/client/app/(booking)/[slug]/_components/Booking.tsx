'use client';

import { AlertCircle, CalendarClock, CalendarX } from 'lucide-react';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import { cn } from '@/src/lib/utils';

import { useBooking } from '../_hooks/useBooking';

import { FieldLabel } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import StepTitle from './StepTitle';
import Wrapper from './Wrapper';

interface IBookingProps {
  barbershopLocalDateUTC: Date;
  availableTimeSlots: IGetAvailableTimeSlotsForBooking;
}

export default function Booking({
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IBookingProps) {
  const {
    professional,
    date,
    selectedTime,
    times,
    minimumInputDate,
    maxInputDate,
    dateError,
    timeError,
    handleInputDateChange,
    handleSelectTime,
  } = useBooking({ barbershopLocalDateUTC, availableTimeSlots });

  if (!professional) {
    return null;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <StepTitle
          title="Selecione dia e hora para agendar"
          icon={CalendarClock}
        />

        {(dateError || timeError) && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{dateError?.message || timeError?.message}</span>
          </div>
        )}

        <FieldLabel className="w-full max-w-xs mx-auto">
          <Input
            type="date"
            name="date"
            value={date}
            onChange={handleInputDateChange}
            min={minimumInputDate}
            max={maxInputDate}
            className="h-10 px-3 border-appointment-border bg-transparent text-white"
          />
        </FieldLabel>

        {dateError && (
          <p className="text-xs text-destructive mt-1">{dateError.message}</p>
        )}
      </div>

      <Wrapper>
        {times.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {times.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  type="button"
                  className={cn(
                    'w-16 h-8.5 rounded-xl border border-border text-white leading-none font-semibold bg-appointment-background transition-all duration-200 cursor-pointer',
                    isSelected && 'bg-cta-accent text-black border-cta-accent',
                  )}
                  key={time}
                  onClick={() => handleSelectTime(time)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <CalendarX size={42} />
            <p className="text-sm text-muted-foreground text-center bg-muted/40 px-4 rounded-xl leading-6">
              Nenhum horário disponível para esta data. Por favor, troque a data
              ou verifique com outro profissional.
            </p>
          </div>
        )}
      </Wrapper>
    </div>
  );
}
