'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

import { useForgotPasswordForm } from '../_hooks/useForgotPasswordForm';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import FormButton from '@/src/components/ui/form-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    error,
    errors,
    isSubmitting,
    isSuccess,
    onSubmit,
  } = useForgotPasswordForm();

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
              E-mail enviado
            </DialogTitle>

            <DialogDescription className="dialog-warning-description">
              Se o e-mail informado estiver cadastrado, você receberá um link
              para redefinir sua senha. Verifique também a caixa de spam.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Link href="/login" className="button-form">
              Voltar para o login
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-tertiary leading-none">
            Esqueceu sua senha?
          </h1>
          <p className="text-sm text-primary">
            Informe seu e-mail e enviaremos um link para você redefinir sua
            senha.
          </p>
        </div>

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
          {error && (
            <span role="alert" className="input-error-message">
              {error}
            </span>
          )}
        </div>

        <FormButton isSubmitting={isSubmitting}>Enviar link</FormButton>

        <div className="flex flex-col items-center gap-2 text-sm">
          <Link href="/login" className="link">
            Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}
