'use client';

import { useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { cn } from '@/src/lib/utils';

import {
  User,
  Scissors,
  CalendarClock,
  BookUser,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Check,
} from 'lucide-react';

import createAppointmentAction from '@/app/actions/create-appointment';
import { showErrorToast } from '@/src/common/lib/toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

import {
  BookingFormProvider,
  useBookingForm,
} from '../_contexts/BookingFormContext';

import {
  IBarbershopBookingInfos,
  IGetAvailableTimeSlotsForBooking,
} from '@/src/common/interfaces/barbershop-booking';

import Professionals from './Professionals';
import Services from './Services';
import Booking from './Booking';
import ClientData from './ClientData';
import SchedulingSummary from './SchedulingSummary';
import Contacts from './Contacts';

interface IBookingFormContainerProps {
  barbershopBookingInfos: IBarbershopBookingInfos;
  timeSlotsByProfessionalAndDate: IGetAvailableTimeSlotsForBooking;
}

export default function BookingFormContainer({
  barbershopBookingInfos,
  timeSlotsByProfessionalAndDate,
}: IBookingFormContainerProps) {
  return (
    <BookingFormProvider>
      <BookingFormWrapper
        barbershopBookingInfos={barbershopBookingInfos}
        timeSlotsByProfessionalAndDate={timeSlotsByProfessionalAndDate}
      />
    </BookingFormProvider>
  );
}

function BookingFormWrapper({
  barbershopBookingInfos,
  timeSlotsByProfessionalAndDate,
}: IBookingFormContainerProps) {
  const { currentStep } = useBookingForm();

  return (
    <div className="px-4">
      <StepperHeader />

      <div className="max-w-300 mx-auto mb-21 md:mb-9 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-start gap-x-16 gap-y-6">
          <div>
            {currentStep === 1 && (
              <Professionals
                professionals={barbershopBookingInfos.employees}
                barbershopBookingInfos={barbershopBookingInfos}
                employeesShiftData={timeSlotsByProfessionalAndDate.employees}
              />
            )}
            {currentStep === 2 && (
              <Services professionals={barbershopBookingInfos.employees} />
            )}
            {currentStep === 3 && (
              <Booking
                barbershopBookingInfos={barbershopBookingInfos}
                timeSlotsByProfessionalAndDate={timeSlotsByProfessionalAndDate}
              />
            )}
            {currentStep === 4 && <ClientData />}
            <StepperFooter />
          </div>

          <div>
            <SchedulingSummary
              professionals={barbershopBookingInfos.employees}
            />
            <Contacts
              whatsAppUrl={barbershopBookingInfos.whatsAppUrl}
              facebookUrl={barbershopBookingInfos.facebookUrl}
              instagramUrl={barbershopBookingInfos.instagramUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepperHeader() {
  const { currentStep, setStep } = useBookingForm();
  const [isPending, startTransition] = useTransition();

  const activeVisualStep = currentStep;

  const steps = [
    { number: 1, label: 'Profissional', icon: User },
    { number: 2, label: 'Serviços', icon: Scissors },
    { number: 3, label: 'Data e Hora', icon: CalendarClock },
    { number: 4, label: 'Seus dados', icon: BookUser },
  ];

  const handleStepClick = (step: number) => {
    startTransition(async () => {
      await setStep(step);
    });
  };

  const progressPercentage =
    ((activeVisualStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative flex justify-between items-start gap-2 py-6 mb-8 max-w-140 mx-auto">
      {/* Horizontal connecting line */}
      <div className="absolute h-0.5 top-11 sm:top-12.25 left-13.75 right-12 bg-appointment-border -translate-y-1/2" />
      <div
        className="absolute h-0.5 top-11 sm:top-12.25 left-13.75 right-12 bg-cta-accent -translate-y-1/2 transition-all duration-500 origin-left"
        style={{
          transform: `scaleX(${progressPercentage / 100})`,
        }}
      />

      {steps.map((step) => {
        const isActive = activeVisualStep === step.number;
        const isCompleted = activeVisualStep > step.number;
        const Icon = step.icon;

        return (
          <button
            key={step.number}
            type="button"
            disabled={isPending}
            onClick={() => handleStepClick(step.number)}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div
              className={cn(
                'size-10 sm:size-12.5 rounded-full flex items-center justify-center bg-appointment-foreground border-2 border-appointment-border text-appointment-text-muted transition-all duration-300',
                isActive && 'bg-cta-accent text-black border-cta-accent-border',
                isCompleted &&
                  'text-cta-accent border-cta-accent bg-cta-accent-border',
              )}
            >
              <Icon className="sm:size-7" />
            </div>

            <span
              className={cn(
                'text-sm sm:text-base transition-colors duration-300 text-center text-appointment-text-muted',
                isActive && 'text-cta-accent',
                isCompleted && 'text-white',
              )}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StepperFooter() {
  const {
    currentStep,
    totalSteps,
    form,
    setStep,
    goToNextStep,
    goToPrevStep,
    validateStep,
  } = useBookingForm();
  const params = useParams() as { slug: string };

  const slug = decodeURIComponent(params.slug);

  const employeeId = form.watch('employeeId');
  const serviceIds = form.watch('serviceIds') || [];
  const date = form.watch('date');
  const selectedTime = form.watch('time');
  const name = form.watch('name');
  const phone = form.watch('phone');
  const email = form.watch('email');

  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    const { error, ok } = await createAppointmentAction({
      name,
      phone,
      email,
      barbershopSlug: slug,
      employeeId,
      serviceIds,
      date,
      time: selectedTime,
    });

    if (!ok) {
      showErrorToast(error, { theme: 'dark', position: 'top-center' });
      return;
    }

    form.reset();

    setOpenDialog(true);
  };

  return (
    <div className="max-md:fixed left-0 bottom-0 z-50 w-full max-md:px-4 max-md:py-2 py-6 max-md:bg-appointment-foreground flex justify-between md:justify-end gap-4 md:gap-6">
      <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
        <DialogContent
          showCloseButton={false}
          className="dialog-warning-content bg-appointment-card-background border border-appointment-border"
        >
          <DialogHeader className="dialog-warning-header">
            <div className="dialog-check-success-wrapper">
              <Check className="dialog-check-success" />
            </div>

            <DialogTitle className="dialog-warning-title">
              E-mail enviado
            </DialogTitle>

            <DialogDescription className="dialog-warning-description text-appointment-text-muted">
              Se o e-mail informado estiver correto, você receberá um link
              para redefinir sua senha. Verifique também a caixa de spam.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setOpenDialog(false);
                setStep(1);
              }}
              className="w-full mt-6 h-12 md:h-10 px-6 rounded-lg bg-cta-accent hover:bg-[#BFA000] text-black text-sm font-bold transition-all duration-200 cursor-pointer"
            >
              Concluir
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentStep > 1 && (
        <button
          type="button"
          onClick={goToPrevStep}
          className="flex items-center gap-1.5 px-3 md:px-4 h-12 md:h-9 rounded-lg border border-appointment-border hover:bg-[#262626] text-sm font-bold transition-all duration-200 cursor-pointer"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
          <span className="max-md:hidden">Voltar</span>
        </button>
      )}

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={goToNextStep}
          className="max-md:flex-1 flex items-center max-md:justify-center gap-1.5 h-12 md:h-9 px-6 rounded-lg bg-cta-accent hover:bg-[#BFA000] text-black text-sm font-bold transition-all duration-200 cursor-pointer"
        >
          Avançar
          <ChevronRight className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            'max-md:flex-1 flex items-center max-md:justify-center gap-1.5 h-12 md:h-9 px-6 rounded-lg bg-cta-accent hover:bg-[#BFA000] text-black text-sm font-bold transition-all duration-200 cursor-pointer',
          )}
          onClick={handleSubmit}
        >
          <CalendarCheck className="size-5" />
          Submeter Agendamento
        </button>
      )}
    </div>
  );
}
