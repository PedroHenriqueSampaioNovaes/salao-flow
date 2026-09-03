'use client';

import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { Input } from '@/src/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';

import { useFormContext } from 'react-hook-form';

import SettingsCard from './SettingsCard';

export default function AccountFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<UpdateBarbershopSchema>();

  return (
    <SettingsCard
      title="Sua conta"
      description="Como você é identificado no painel"
    >
      <div className="flex flex-col gap-4">
        <Field data-invalid={!!errors.name} className="max-w-md">
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            id="name"
            placeholder="Ex.: Cláudio Barbosa"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email} className="max-w-md">
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            placeholder="Ex.: claudio@navalha.app"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <PhoneInputField
          id="phone"
          label="Telefone"
          name="phone"
          control={control}
          className="max-w-md"
          placeholder="Ex.: (11) 98814-8020"
          error={errors.phone?.message}
        />
      </div>
    </SettingsCard>
  );
}
