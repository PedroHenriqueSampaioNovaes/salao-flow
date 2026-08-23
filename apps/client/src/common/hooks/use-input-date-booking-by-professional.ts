'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

interface IBookingForm {
  employeeId: number;
  date: string;
  time: string;
}

interface IUseDateBookingParams {
  timeSlotsByProfessionalAndDate: IGetAvailableTimeSlotsForBooking;
}

export function useInputDateBookingByProfessional({
  timeSlotsByProfessionalAndDate,
}: IUseDateBookingParams) {
  const { watch, setValue } = useFormContext<IBookingForm>();

  const date = watch('date');
  const employeeId = watch('employeeId');

  const professional = useMemo(() => {
    const professionalFound = timeSlotsByProfessionalAndDate.employees.find(
      (employee) => employee.id === Number(employeeId),
    );

    if (!professionalFound) return timeSlotsByProfessionalAndDate.employees[0];
    return professionalFound;
  }, [timeSlotsByProfessionalAndDate.employees, employeeId]);

  const minimumInputDate = professional.date;

  const maximumInputDate = useMemo(() => {
    const date = new Date(timeSlotsByProfessionalAndDate.date);
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  }, [timeSlotsByProfessionalAndDate.date]);

  const handleInputDateChange = useMemo(() => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (!inputValue) return;

      if (minimumInputDate > inputValue || maximumInputDate < inputValue) {
        return;
      }

      setValue('date', inputValue);
      setValue('time', '');
    };
  }, [minimumInputDate, maximumInputDate, setValue]);

  return {
    value: date,
    minimumInputDate,
    maximumInputDate,
    handleInputDateChange,
  };
}
