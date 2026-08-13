'use client';

import React, { createContext, useContext, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from '@sistema-barbearia/validators';

export const bookingFormSchema = z.object({
  employeeId: z.number({
    message: 'Por favor, selecione um profissional.',
  }),
  serviceIds: z
    .array(z.uuid())
    .min(1, 'Por favor, selecione pelo menos um serviço.'),
  date: z
    .string({ message: 'Por favor, selecione uma data.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Por favor, selecione uma data válida.'),
  time: z
    .string({ message: 'Por favor, selecione um horário.' })
    .min(1, 'Por favor, selecione um horário.'),
  name: z.string().min(1, 'Por favor, informe seu nome.'),
  phone: z
    .string({ message: 'Por favor, informe seu telefone.' })
    .regex(
      /^(\(?\d{2}\)?\s?)(9?\d{4})-\d{4}$/,
      'Por favor, informe um telefone válido.',
    ),
  email: z.email('Por favor, informe um e-mail válido.'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormContextType {
  currentStep: number;
  totalSteps: number;
  form: UseFormReturn<BookingFormValues>;
  goToNextStep: () => Promise<boolean>;
  goToPrevStep: () => void;
  setStep: (step: number) => Promise<boolean>;
}

const BookingFormContext = createContext<BookingFormContextType | undefined>(
  undefined,
);

export function BookingFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      employeeId: undefined,
      serviceIds: [],
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
    },
    mode: 'onTouched',
  });

  const validateStep = async (step: number) => {
    if (step === 1) {
      const result = await form.trigger(['employeeId']);
      return result;
    }
    if (step === 2) {
      const result = await form.trigger(['serviceIds']);
      return result;
    }
    if (step === 3) {
      const result = await form.trigger(['date', 'time']);
      return result;
    }
    if (step === 4) {
      const result = await form.trigger(['name', 'phone']);
      return result;
    }
    return true;
  };

  const goToNextStep = async () => {
    if (currentStep < totalSteps) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep((prev) => prev + 1);
        return true;
      }
    }
    return false;
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setStep = async (step: number) => {
    if (step === currentStep) return true;

    if (step < currentStep) {
      setCurrentStep(step);
      return true;
    }

    // Moving forward: we must validate all steps between currentStep and targeted step
    let tempStep = currentStep;
    while (tempStep < step) {
      const isValid = await validateStep(tempStep);
      if (!isValid) {
        return false;
      }
      tempStep++;
    }

    setCurrentStep(step);
    return true;
  };

  return (
    <BookingFormContext.Provider
      value={{
        currentStep,
        totalSteps,
        form,
        goToNextStep,
        goToPrevStep,
        setStep,
      }}
    >
      {children}
    </BookingFormContext.Provider>
  );
}

export function useBookingForm() {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingForm must be used within a BookingFormProvider');
  }
  return context;
}
