'use client';

import { useFormContext } from 'react-hook-form';
import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

import { PasswordInputToggle } from '@/src/components/ui/password-input-toggle';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';

import SettingsCard from './SettingsCard';

export default function PasswordFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<UpdateBarbershopSchema>();

  return (
    <SettingsCard
      title="Alterar senha"
      description="Informe a senha atual e as novas senhas para confirmar a alteração"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="currentPassword">Senha atual</FieldLabel>
          <PasswordInputToggle
            id="currentPassword"
            aria-invalid={!!errors.currentPassword}
            {...register('currentPassword')}
          />
          <FieldError>{errors.currentPassword?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Nova senha</FieldLabel>
          <PasswordInputToggle
            id="password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">
            Confirmar nova senha
          </FieldLabel>
          <PasswordInputToggle
            id="confirmPassword"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <FieldError>{errors.confirmPassword?.message}</FieldError>
        </Field>
      </div>
    </SettingsCard>
  );
}
