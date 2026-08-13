'use client';

import { BookUser } from 'lucide-react';

import { useBookingForm } from '../_contexts/BookingFormContext';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import StepTitle from './StepTitle';
import { PhoneInputField } from '@/app/(auth)/register/_components/PhoneInputField';
import Wrapper from './Wrapper';

export default function ClientData() {
  const { form } = useBookingForm();
  const { register, control, formState } = form;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <StepTitle title="Seus dados" icon={BookUser} />

      <Wrapper classNames="flex flex-col gap-4">
        <Field data-invalid={!!formState.errors.name}>
          <FieldLabel htmlFor="name">Seu nome</FieldLabel>
          <Input
            id="name"
            aria-invalid={!!formState.errors.name}
            {...register('name')}
            className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent"
          />
          <FieldError>{formState.errors.name?.message}</FieldError>
        </Field>
        <div className="md:flex gap-4">
          <PhoneInputField
            id="phone"
            label="Celular / WhatsApp"
            name="phone"
            control={control}
            error={formState.errors.phone?.message}
            className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent"
          />
          <Field data-invalid={!!formState.errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              aria-invalid={!!formState.errors.email}
              {...register('email')}
              className="border-appointment-border bg-appointment-background h-9 placeholder:text-appointment-text-muted focus-visible:border-cta-accent"
            />
            <FieldError>{formState.errors.email?.message}</FieldError>
          </Field>
        </div>
      </Wrapper>
    </div>
  );
}
