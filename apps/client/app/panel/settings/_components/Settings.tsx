'use client';

import { useSettingsForm } from '../_hooks/useSettingsForm';

import { Input } from '@/src/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field';
import { PhoneInputField } from '@/app/(auth)/register/_components/PhoneInputField';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

const timezones = [
  { label: 'Brasília (GMT-3)', value: 'America/Sao_Paulo' },
  { label: 'Fernando de Noronha (GMT-2)', value: 'America/Noronha' },
  { label: 'Amazonas (GMT-4)', value: 'America/Manaus' },
  { label: 'Acre (GMT-5)', value: 'America/Rio_Branco' },
];

export default function Settings() {
  const { register, onSubmit, handleSubmit, control, errors } =
    useSettingsForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h1>Configurações</h1>
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          placeholder="Nome da barbearia."
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <Input
          id="email"
          placeholder="E-mail do cliente."
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
        error={errors.phone?.message}
      />

      <Field data-invalid={!!errors.address}>
        <FieldLabel htmlFor="address">Endereço</FieldLabel>
        <Input
          id="address"
          placeholder="Endereço da barbearia."
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

      <Field data-invalid={!!errors.slug}>
        <FieldLabel htmlFor="slug">Slug</FieldLabel>
        <Input
          id="slug"
          placeholder="Slug da barbearia."
          aria-invalid={!!errors.slug}
          {...register('slug')}
        />
        <FieldError>{errors.slug?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.currentPassword}>
        <FieldLabel htmlFor="currentPassword">Senha atual</FieldLabel>
        <Input
          id="currentPassword"
          type="password"
          aria-invalid={!!errors.currentPassword}
          {...register('currentPassword')}
        />
        <FieldError>{errors.currentPassword?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Nova senha</FieldLabel>
        <Input
          id="password"
          type="password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.confirmPassword}>
        <FieldLabel htmlFor="confirmPassword">
          Confirme sua nova senha
        </FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        <FieldError>{errors.confirmPassword?.message}</FieldError>
      </Field>

      <button
        type="submit"
        className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
      >
        Salvar
      </button>
    </form>
  );
}
