'use client';

import { useRegisterForm } from '../_hooks/useRegisterForm';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { PhoneInputField } from './PhoneInputField';

export function RegisterForm() {
  const { register, handleSubmit, control, errors, isSubmitting, onSubmit } =
    useRegisterForm();

  return (
    <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            id="name"
            placeholder="Digite o nome da barbearia"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Digite o e-mail"
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
            placeholder="Digite o endereço completo"
            aria-invalid={!!errors.address}
            {...register('address')}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirmar</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar senha"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <span className="h-5 w-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            'Registrar Barbearia'
          )}
        </button>
      </form>
    </div>
  );
}
