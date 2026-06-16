'use client';

import { useLoginForm } from '../_hooks/useLoginForm';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';

export function LoginForm() {
  const { register, handleSubmit, error, errors, isSubmitting, onSubmit } =
    useLoginForm();

  return (
    <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        {error && <span className="text-red-500">{error}</span>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <span className="h-5 w-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            'Entrar'
          )}
        </button>
      </form>
    </div>
  );
}
