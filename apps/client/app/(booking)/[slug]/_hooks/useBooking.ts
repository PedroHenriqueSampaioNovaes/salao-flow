'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import getAvailableTimeSlotsForBookingAction from '@/app/actions/get-available-time-slots-for-booking';

import { useBookingForm } from '../_contexts/BookingFormContext';

interface IUseBookingProps {
  barbershopLocalDateUTC: Date;
  availableTimeSlots: IGetAvailableTimeSlotsForBooking;
}

export function useBooking({
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IUseBookingProps) {
  const { slug } = useParams() as { slug: string };
  const { form, setStep } = useBookingForm();

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
    setStep(1);
  }

  const minimumInputDate = professional?.date;
  const maxInputDate = professional
    ? new Date(
        barbershopLocalDateUTC.getUTCFullYear(),
        barbershopLocalDateUTC.getUTCMonth(),
        barbershopLocalDateUTC.getUTCDate() + 90,
      ).toLocaleDateString('en-CA')
    : '';

  async function handleInputDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!professional) return;
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
      employeeId: professional.id,
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
      professionalId: professional.id,
      date: inputValue,
      slots: employee.availableSlots,
    });
  }

  const handleSelectTime = (time: string) => {
    form.setValue('time', time, { shouldValidate: true });
  };

  return {
    professional,
    date,
    selectedTime,
    times,
    minimumInputDate,
    maxInputDate,
    dateError: form.formState.errors.date,
    timeError: form.formState.errors.time,
    handleInputDateChange,
    handleSelectTime,
  };
}
