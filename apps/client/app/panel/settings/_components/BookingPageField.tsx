'use client';

import { useSyncExternalStore } from 'react';
import { useFormContext } from 'react-hook-form';
import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { Input } from '@/src/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/src/components/ui/field';

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
        <Input id="slug" aria-invalid={!!errors.slug} {...register('slug')} />
        <FieldDescription className="-mt-1! text-xs">
          Exemplo: {origin}/meu-negocio
        </FieldDescription>
        <FieldError>{errors.slug?.message}</FieldError>
      </Field>
    </SettingsCard>
  );
}
