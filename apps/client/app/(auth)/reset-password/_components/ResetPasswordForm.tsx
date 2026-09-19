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
  DialogFooter,
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
  } = useResetPasswordForm(token);

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)]">
      <Dialog open={isSuccess}>
        <DialogContent
          showCloseButton={false}
          className="dialog-warning-content"
        >
          <DialogHeader className="dialog-warning-header">
            <div className="dialog-check-success-wrapper">
              <Check className="dialog-check-success" />
            </div>

            <DialogTitle className="dialog-warning-title">
              Senha redefinida
            </DialogTitle>

            <DialogDescription className="dialog-warning-description">
              Sua senha foi redefinida com sucesso. Agora você já pode entrar
              com sua nova senha.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Link href="/login" className="button-form">
              Ir para o login
            </Link>
          </DialogFooter>
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
