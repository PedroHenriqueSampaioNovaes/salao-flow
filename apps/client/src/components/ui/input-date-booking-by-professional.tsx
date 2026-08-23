'use client';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import { useInputDateBookingByProfessional } from '@/src/common/hooks/use-input-date-booking-by-professional';

import { Input } from './input';

interface IDateForBooking {
  timeSlotsByProfessionalAndDate: IGetAvailableTimeSlotsForBooking;
  className?: string;
}

export default function InputDateBookingByProfessional({
  timeSlotsByProfessionalAndDate,
  className,
}: IDateForBooking) {
  const { minimumInputDate, maximumInputDate, handleInputDateChange, value } =
    useInputDateBookingByProfessional({
      timeSlotsByProfessionalAndDate,
    });

  return (
    <Input
      type="date"
      id="date"
      name="date"
      value={value}
      onChange={handleInputDateChange}
      min={minimumInputDate}
      max={maximumInputDate}
      className={className}
    />
  );
}
