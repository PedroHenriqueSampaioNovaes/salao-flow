'use client';

import { cva } from 'class-variance-authority';
import { CalendarX } from 'lucide-react';

import { cn } from '@/src/lib/utils';

import {
  IServiceDuration,
  IWeekdaySchedule,
  useTimeSlotsBooking,
} from '@/src/common/hooks/use-time-slots-booking';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

interface ISelectionTimeSlotsBooking {
  slug: string;
  employeesShift: IGetAvailableTimeSlotsForBooking['employees'];
  employeeSchedule?: IWeekdaySchedule[];
  services?: IServiceDuration[];
  isBookingPage?: boolean;
  isLoadingData?: boolean;
}

const timeSlotVariants = cva(
  'w-16 h-8.5 rounded-lg border border-border leading-none font-semibold transition-all duration-200 cursor-pointer',
  {
    variants: {
      isBookingPage: {
        true: 'bg-appointment-background text-white',
        false: '',
      },
      selected: {
        true: 'border-accent bg-accent/25',
        false: '',
      },
    },
    compoundVariants: [
      {
        isBookingPage: true,
        selected: true,
        className: 'bg-cta-accent text-black border-cta-accent',
      },
    ],
  },
);

export default function SelectionTimeSlotsBooking({
  slug,
  employeesShift,
  employeeSchedule,
  services,
  isBookingPage = false,
  isLoadingData = false,
}: ISelectionTimeSlotsBooking) {
  const { times, selectedTime, isPending, handleSelectTimeSlot } =
    useTimeSlotsBooking({ slug, employeesShift, employeeSchedule, services });

  if (isPending || isLoadingData) {
    return (
      <div className="flex justify-center py-4">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-transparent" />
      </div>
    );
  }

  if (times.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <CalendarX size={42} />
        <p className="text-sm text-muted-foreground text-center px-4 rounded-xl leading-6">
          Nenhum horário disponível para esta data. Por favor, troque a data ou
          verifique com outro profissional.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {times.map((time) => (
        <button
          key={time}
          type="button"
          className={cn(
            timeSlotVariants({
              isBookingPage,
              selected: selectedTime === time,
            }),
          )}
          onClick={() => handleSelectTimeSlot(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
