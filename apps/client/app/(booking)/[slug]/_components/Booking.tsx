'use client';

import { useEffect } from 'react';
import { AlertCircle, CalendarClock } from 'lucide-react';
import { useParams } from 'next/navigation';

import { IGetAvailableTimeSlotsForBooking } from '@/src/common/interfaces/barbershop-booking';

import { useBookingForm } from '../_contexts/BookingFormContext';

import { FieldLabel } from '@/src/components/ui/field';
import StepTitle from './StepTitle';
import Wrapper from './Wrapper';
import InputDateBookingByProfessional from '@/src/components/ui/input-date-booking-by-professional';
import SelectionTimeSlotsBooking from '@/src/components/ui/selection-time-slots-booking';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

interface IBookingProps {
  timeSlotsByProfessionalAndDate: IGetAvailableTimeSlotsForBooking;
}

export default function Booking({
  timeSlotsByProfessionalAndDate,
}: IBookingProps) {
  const { slug } = useParams() as { slug: string };

  const { form, setStep } = useBookingForm();

  const employeeId = form.watch('employeeId');

  const dateError = form.formState.errors.date;
  const timeError = form.formState.errors.time;

  useEffect(() => {
    if (!employeeId) setStep(1);
  }, [employeeId, setStep]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div>
        <StepTitle
          title="Selecione dia e hora para agendar"
          icon={CalendarClock}
        />

        {(dateError || timeError) && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="size-6" />
            <AlertDescription>
              {dateError?.message || timeError?.message}
            </AlertDescription>
          </Alert>
        )}

        <FieldLabel className="w-full max-w-xs mx-auto">
          <InputDateBookingByProfessional
            timeSlotsByProfessionalAndDate={timeSlotsByProfessionalAndDate}
            className="focus:border-cta-accent focus:ring-0 border-appointment-border"
          />
        </FieldLabel>
      </div>

      <Wrapper>
        <SelectionTimeSlotsBooking
          slug={slug}
          employeesShift={timeSlotsByProfessionalAndDate.employees}
          isBookingPage
        />
      </Wrapper>
    </div>
  );
}
