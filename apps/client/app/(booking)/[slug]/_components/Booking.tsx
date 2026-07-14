'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Calendar, Clock, AlertCircle } from 'lucide-react';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { cn } from '@/src/lib/utils';

import { FieldLabel } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { useBookingForm } from './BookingFormContext';

interface IBookingProps {
  barbershopLocalDateUTC: Date;
  availableTimeSlots: IGetAvailableTimeSlotsForBooking;
}

export default function Booking({
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IBookingProps) {
  const { slug } = useParams() as { slug: string };
  const { form } = useBookingForm();

  const employeeId = form.watch('employeeId');
  const date = form.watch('date');
  const selectedTime = form.watch('time');

  const professional = useMemo(
    () => availableTimeSlots.employees.find(({ id }) => id === employeeId),
    [availableTimeSlots, employeeId],
  );

  const [fetchedTimes, setFetchedTimes] = useState<{
    professionalId: number;
    date: string;
    slots: string[];
  } | null>(null);

  const times = useMemo(() => {
    if (!professional) return [];
    if (
      fetchedTimes &&
      fetchedTimes.professionalId === professional.id &&
      fetchedTimes.date === date
    ) {
      return fetchedTimes.slots;
    }
    if (date === professional.date) {
      return professional.availableSlots ?? [];
    }
    return [];
  }, [professional, date, fetchedTimes]);

  useEffect(() => {
    if (!professional) return;
    if (!date) {
      form.setValue('date', professional.date);
      return;
    }
    if (date === professional.date) {
      return;
    }
    if (
      fetchedTimes &&
      fetchedTimes.professionalId === professional.id &&
      fetchedTimes.date === date
    ) {
      return;
    }

    const fetchTimes = async () => {
      const { data, ok } = await getAvailableTimeSlotsForBookingAction({
        slug,
        dateString: date,
        employeeId: professional.id,
        lookForNextAvailableTimeSlot: 0,
      });
      if (ok && data) {
        const employee = data.employees[0];
        if (employee) {
          setFetchedTimes({
            professionalId: professional.id,
            date,
            slots: employee.availableSlots,
          });
        }
      }
    };
    fetchTimes();
  }, [professional, date, fetchedTimes, form, slug]);

  if (!professional) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-2xl bg-muted/25 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-medium">
          Nenhum profissional selecionado. Por favor, volte ao passo 1.
        </p>
      </div>
    );
  }

  const professionalId = professional.id;
  const minimumInputDate = professional.date;

  const maxInputDate = new Date(
    barbershopLocalDateUTC.getUTCFullYear(),
    barbershopLocalDateUTC.getUTCMonth(),
    barbershopLocalDateUTC.getUTCDate() + 90,
  ).toLocaleDateString('en-CA');

  async function handleInputDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    if (!inputValue) return;

    const targetDate = new Date(inputValue);
    if (
      barbershopLocalDateUTC.getUTCDate() > targetDate.getUTCDate() &&
      barbershopLocalDateUTC.getMonth() >= targetDate.getUTCMonth()
    ) {
      return;
    }

    const {
      data: updatedTimeSlots,
      ok,
      error,
    } = await getAvailableTimeSlotsForBookingAction({
      slug,
      dateString: inputValue,
      employeeId: professionalId,
      lookForNextAvailableTimeSlot: 0,
    });

    if (!ok) {
      alert(error || 'Erro ao buscar horários disponíveis.');
      setFetchedTimes(null);
      return;
    }

    const employee = updatedTimeSlots.employees[0];
    form.setValue('date', inputValue, { shouldValidate: true });
    form.setValue('time', '');
    setFetchedTimes({
      professionalId: professionalId,
      date: inputValue,
      slots: employee.availableSlots,
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Selecione dia e hora para agendar
        </h2>

        <div className="space-y-2">
          <FieldLabel htmlFor="date" className="text-sm font-semibold">
            Dia:
          </FieldLabel>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={handleInputDateChange}
            min={minimumInputDate}
            max={maxInputDate}
            className="w-full max-w-xs"
          />
          {form.formState.errors.date && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <FieldLabel className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Selecione um Horário Disponível:
        </FieldLabel>

        {times.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {times.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  type="button"
                  className={cn(
                    'w-20 h-10 rounded-xl border border-border/80 shadow-sm text-sm font-semibold transition-all duration-200 cursor-pointer',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary scale-[1.05] shadow-md'
                      : 'bg-card text-foreground hover:bg-accent/50',
                  )}
                  key={time}
                  onClick={() =>
                    form.setValue('time', time, { shouldValidate: true })
                  }
                >
                  {time}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground bg-muted/40 p-4 rounded-xl">
            Nenhum horário disponível para esta data. Por favor, troque a data
            ou verifique com outro profissional.
          </p>
        )}

        {form.formState.errors.time && (
          <p className="text-xs text-destructive mt-1">
            {form.formState.errors.time.message}
          </p>
        )}
      </div>
    </div>
  );
}
