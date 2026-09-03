'use client';

import { useSyncExternalStore } from 'react';
import { useFormContext } from 'react-hook-form';
import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { Input } from '@/src/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';

import SettingsCard from './SettingsCard';

const noopSubscribe = () => () => {};
const getOriginSnapshot = () => window.location.origin;
const getOriginServerSnapshot = () => '';

export default function BookingPageField() {
  const origin = useSyncExternalStore(
    noopSubscribe,
    getOriginSnapshot,
    getOriginServerSnapshot,
  );
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateBarbershopSchema>();

  return (
    <SettingsCard
      title="Página de agendamento"
      description="Escolha qual a URL será usada pelos seus clientes para acessarem a página de agendamento."
    >
      <Field data-invalid={!!errors.slug} className="max-w-md">
        <FieldLabel htmlFor="slug">URL da página de agendamento</FieldLabel>
        <div className="flex items-center rounded-lg border border-border/20 px-3 has-focus:border-accent has-focus:ring-2 has-focus:ring-accent/25">
          <span className="text-sm text-secondary shrink-0">{origin}/</span>
          <Input
            id="slug"
            aria-invalid={!!errors.slug}
            className="border-0 px-1 focus:ring-0 focus:border-0"
            {...register('slug')}
          />
        </div>
        <FieldError>{errors.slug?.message}</FieldError>
      </Field>
    </SettingsCard>
  );
}
