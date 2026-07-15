'use client';

import { useTransition } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/src/lib/utils';

import { User, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { BookingFormProvider, useBookingForm } from './BookingFormContext';
import Professionals from './Professionals';
import Booking from './Booking';
import createAppointmentAction from '@/app/actions/create-appointment';

import {
  IEmployee,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

interface IBookingFormContainerProps {
  professionals: IEmployee[];
  barbershopLocalDateUTC: Date;
  availableTimeSlots: IGetAvailableTimeSlotsForBooking;
}

export default function BookingFormContainer({
  professionals,
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IBookingFormContainerProps) {
  return (
    <BookingFormProvider>
      <BookingFormWrapper
        professionals={professionals}
        barbershopLocalDateUTC={barbershopLocalDateUTC}
        availableTimeSlots={availableTimeSlots}
      />
    </BookingFormProvider>
  );
}

function BookingFormWrapper({
  professionals,
  barbershopLocalDateUTC,
  availableTimeSlots,
}: IBookingFormContainerProps) {
  const { currentStep } = useBookingForm();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-card border border-border/60 rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300">
      <StepperHeader />

      <div className="min-h-[400px] mb-8 transition-all duration-300">
        {currentStep === 1 && (
          <Professionals
            professionals={professionals}
            barbershopLocalDateUTC={barbershopLocalDateUTC}
            employeesShiftData={availableTimeSlots.employees}
          />
        )}
        {currentStep === 2 && (
          <Booking
            barbershopLocalDateUTC={barbershopLocalDateUTC}
            availableTimeSlots={availableTimeSlots}
          />
        )}
      </div>

      <StepperFooter />
    </div>
  );
}

function StepperHeader() {
  const { currentStep, setStep } = useBookingForm();
  const [isPending, startTransition] = useTransition();

  const steps = [
    { number: 1, label: 'Profissional e Serviços', icon: User },
    { number: 2, label: 'Data e Horário', icon: Calendar },
  ];

  const handleStepClick = (stepNumber: number) => {
    startTransition(async () => {
      await setStep(stepNumber);
    });
  };

  return (
    <div className="relative flex justify-between items-center mb-8 pb-6 border-b border-border/40">
      {/* Progress Line */}
      <div className="absolute top-[28px] left-[40px] right-[40px] h-[3px] bg-muted -translate-y-1/2 z-0" />
      <div
        className="absolute top-[28px] left-[40px] h-[3px] bg-primary -translate-y-1/2 z-0 transition-all duration-500"
        style={{ width: currentStep === 1 ? '0%' : 'calc(100% - 80px)' }}
      />

      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const Icon = step.icon;

        return (
          <button
            key={step.number}
            type="button"
            disabled={isPending}
            onClick={() => handleStepClick(step.number)}
            className={cn(
              'relative z-10 flex flex-col items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-accent/40',
              isActive ? 'text-primary scale-105' : 'text-muted-foreground',
              isCompleted && 'text-primary/80',
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-md',
                isActive
                  ? 'bg-primary border-primary text-primary-foreground font-bold scale-110'
                  : isCompleted
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-background border-muted text-muted-foreground',
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
                Passo {step.number}
              </span>
              <span className="text-sm font-bold">{step.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StepperFooter() {
  const { currentStep, goToNextStep, goToPrevStep, form } = useBookingForm();
  const params = useParams() as { slug: string };

  const slug = decodeURIComponent(params.slug);

  const employeeId = form.watch('employeeId');
  const serviceIds = form.watch('serviceIds') || [];
  const date = form.watch('date');
  const selectedTime = form.watch('time');
  const isBookingValid = !!selectedTime;

  const handleSubmit = async () => {
    if (!isBookingValid) return;

    const { error, ok } = await createAppointmentAction({
      name: 'Pedro',
      phone: '(11) 98814-8020',
      barbershopSlug: slug,
      employeeId,
      serviceIds,
      date,
      time: selectedTime,
    });

    if (!ok) {
      alert(error);
    } else {
      alert('Agendamento realizado com sucesso!');
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t border-border/40">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={goToPrevStep}
          className="flex items-center gap-2 py-2.5 px-6 rounded-xl border border-input bg-background hover:bg-accent text-accent-foreground font-semibold shadow-sm transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      ) : (
        <div />
      )}

      {currentStep < 2 ? (
        <button
          type="button"
          onClick={goToNextStep}
          className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-semibold shadow-lg transition-all duration-200 cursor-pointer"
        >
          Próximo
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          disabled={!isBookingValid}
          className={cn(
            'px-8 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer',
            isBookingValid
              ? 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg hover:shadow-xl scale-[1.02]'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
          )}
          onClick={handleSubmit}
        >
          Submeter Agendamento
        </button>
      )}
    </div>
  );
}
