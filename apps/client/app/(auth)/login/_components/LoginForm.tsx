'use client';

import Link from 'next/link';

import { useLoginForm } from '../_hooks/useLoginForm';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import FormButton from '@/src/components/ui/form-button';

export function LoginForm() {
  const { register, handleSubmit, error, errors, isSubmitting, onSubmit } =
    useLoginForm();

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <h1 className="text-center text-2xl font-bold text-tertiary leading-none">
          Entrar
        </h1>

        <div className="flex flex-col gap-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className="font-bold text-primary">
              E-mail
            </FieldLabel>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="font-bold text-primary">
              Senha
            </FieldLabel>
            <Input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </Field>
          {error && (
            <span role="alert" className="input-error-message">
              {error}
            </span>
          )}
        </div>

        <FormButton isSubmitting={isSubmitting}>Entrar</FormButton>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link href="/forgot-password" className="link">
            Esqueceu sua senha?
          </Link>
          <p className="text-primary">
            Não tem conta?{' '}
            <Link href="/register" className="link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
