'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

import { useResetPasswordForm } from '../_hooks/useResetPasswordForm';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import FormButton from '@/src/components/ui/form-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    error,
    errors,
    isSubmitting,
    isSuccess,
    onSubmit,
    goToLogin,
  } = useResetPasswordForm(token);

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)]">
      <Dialog open={isSuccess} onOpenChange={(open) => !open && goToLogin()}>
        <DialogContent showCloseButton={false} className="text-center gap-0">
          <DialogHeader className="flex-col justify-center gap-4">
            <div className="size-14 rounded-full bg-green-100 flex items-center justify-center mb-2 mx-auto">
              <Check className="size-7 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">Senha redefinida</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm max-w-70 mx-auto">
            Sua senha foi redefinida com sucesso. Agora você já pode entrar
            com sua nova senha.
          </DialogDescription>

          <button
            type="button"
            onClick={goToLogin}
            className="w-full mt-6 h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold transition-all duration-200 cursor-pointer"
          >
            Ir para o login
          </button>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-tertiary leading-none">
            Redefinir senha
          </h1>
          <p className="text-sm text-primary">
            Escolha uma nova senha para acessar sua conta.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="font-bold text-primary">
              Nova senha
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

        <FormButton isSubmitting={isSubmitting}>Redefinir senha</FormButton>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link href="/login" className="link">
            Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}
