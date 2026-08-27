'use client';

import { AlertCircle, BookUser } from 'lucide-react';

import { useBookingForm } from '../_contexts/BookingFormContext';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import StepTitle from './StepTitle';
import Wrapper from './Wrapper';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';
import { Alert, AlertDescription } from '@/src/components/ui/alert';

export default function ClientData() {
  const { form } = useBookingForm();
  const { register, control, formState } = form;

  const nameError = form.formState.errors.name;
  const phoneError = form.formState.errors.phone;
  const emailError = form.formState.errors.email;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <StepTitle title="Seus dados" icon={BookUser} />

      {(nameError || phoneError || emailError) && (
        <Alert variant="warning" className="mb-4 sticky top-2.5">
          <AlertCircle className="size-6" />
          <AlertDescription>
            {nameError?.message || phoneError?.message || emailError?.message}
          </AlertDescription>
        </Alert>
      )}

      <Wrapper classNames="flex flex-col gap-4">
        <Field data-invalid={!!formState.errors.name}>
          <FieldLabel htmlFor="name">Seu nome</FieldLabel>
          <Input
            id="name"
            aria-invalid={!!formState.errors.name}
            {...register('name')}
            className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent focus:ring-appointment-border/25"
          />
          <FieldError>{formState.errors.name?.message}</FieldError>
        </Field>
        <div className="flex max-md:flex-col gap-4">
          <PhoneInputField
            id="phone"
            label="Celular / WhatsApp"
            name="phone"
            control={control}
            error={formState.errors.phone?.message}
            className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent focus:ring-appointment-border/25"
          />
          <Field data-invalid={!!formState.errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              aria-invalid={!!formState.errors.email}
              {...register('email')}
              className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent focus:ring-appointment-border/25"
            />
            <FieldError>{formState.errors.email?.message}</FieldError>
          </Field>
        </div>
      </Wrapper>
    </div>
  );
}
