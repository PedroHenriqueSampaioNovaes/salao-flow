'use client';

import { useFormContext } from 'react-hook-form';
import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { Input } from '@/src/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';

import SettingsCard from './SettingsCard';

export default function SocialMediaFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateBarbershopSchema>();

  return (
    <SettingsCard
      title="Redes sociais"
      description="Exibidas abaixo do resumo do agendamento na página de agendamento"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field data-invalid={!!errors.whatsAppUrl} className="max-w-md">
          <FieldLabel htmlFor="whatsAppUrl">WhatsApp</FieldLabel>
          <Input
            id="whatsAppUrl"
            aria-invalid={!!errors.whatsAppUrl}
            placeholder="wa.me/5511911112222"
            {...register('whatsAppUrl')}
          />
          <FieldError>{errors.whatsAppUrl?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.instagramUrl} className="max-w-md">
          <FieldLabel htmlFor="instagramUrl">Instagram</FieldLabel>
          <Input
            id="instagramUrl"
            aria-invalid={!!errors.instagramUrl}
            placeholder="https://instagram.com/seunegocio"
            {...register('instagramUrl')}
          />
          <FieldError>{errors.instagramUrl?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.facebookUrl} className="max-w-md">
          <FieldLabel htmlFor="facebookUrl">Facebook</FieldLabel>
          <Input
            id="facebookUrl"
            aria-invalid={!!errors.facebookUrl}
            placeholder="https://facebook.com/seunegocio"
            {...register('facebookUrl')}
          />
          <FieldError>{errors.facebookUrl?.message}</FieldError>
        </Field>
      </div>
    </SettingsCard>
  );
}
