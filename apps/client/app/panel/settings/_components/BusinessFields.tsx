'use client';

import { useFormContext } from 'react-hook-form';
import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { Input } from '@/src/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

import SettingsCard from './SettingsCard';

const timezones = [
  { label: 'Brasília (GMT-3)', value: 'America/Sao_Paulo' },
  { label: 'Fernando de Noronha (GMT-2)', value: 'America/Noronha' },
  { label: 'Amazonas (GMT-4)', value: 'America/Manaus' },
  { label: 'Acre (GMT-5)', value: 'America/Rio_Branco' },
];

export default function BusinessFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateBarbershopSchema>();

  return (
    <SettingsCard
      title="Sobre seu negócio"
      description="Configure o nome, e-mail e o fuso horário"
    >
      <div className="flex flex-col gap-4">
        <Field data-invalid={!!errors.businessName}>
          <FieldLabel htmlFor="businessName">Nome comercial</FieldLabel>
          <Input
            id="businessName"
            placeholder="Ex.: Carlos Studio"
            aria-invalid={!!errors.businessName}
            {...register('businessName')}
          />
          <FieldError>{errors.businessName?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address">Endereço</FieldLabel>
          <Input
            id="address"
            placeholder="Ex.: Rua das Palmeiras, 120 - São Paulo"
            aria-invalid={!!errors.address}
            {...register('address')}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.timezone}>
          <FieldLabel htmlFor="timezone">Fuso horário</FieldLabel>
          <NativeSelect
            id="timezone"
            aria-invalid={!!errors.timezone}
            {...register('timezone')}
          >
            {timezones.map((timezone) => (
              <NativeSelectOption key={timezone.value} value={timezone.value}>
                {timezone.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errors.timezone?.message}</FieldError>
        </Field>
      </div>
    </SettingsCard>
  );
}
