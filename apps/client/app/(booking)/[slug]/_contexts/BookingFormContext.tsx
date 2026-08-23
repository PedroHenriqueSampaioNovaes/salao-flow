'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  bookingFormSchema,
  BookingFormSchema,
} from '@/src/common/schemas/booking';

interface BookingFormContextType {
  currentStep: number;
  totalSteps: number;
  form: UseFormReturn<BookingFormSchema>;
  goToNextStep: () => Promise<boolean>;
  goToPrevStep: () => void;
  setStep: (step: number) => Promise<boolean>;
  validateStep: (step: number) => Promise<boolean>;
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

  const form = useForm<BookingFormSchema>({
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

  const validateStep = useCallback(
    async (step: number) => {
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
        const result = await form.trigger(['name', 'phone', 'email']);
        return result;
      }
      return true;
    },
    [form],
  );

  const goToNextStep = useCallback(async () => {
    if (currentStep < totalSteps) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep((prev) => prev + 1);
        return true;
      }
    }
    return false;
  }, [currentStep, totalSteps, validateStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const setStep = useCallback(
    async (step: number) => {
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
    },
    [currentStep, validateStep],
  );

  return (
    <BookingFormContext.Provider
      value={{
        currentStep,
        totalSteps,
        form,
        goToNextStep,
        goToPrevStep,
        setStep,
        validateStep,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
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
