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
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog-form';

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
        <DialogContent showCloseButton={false} className="text-center gap-0">
          <DialogHeader className="flex-col justify-center gap-4">
            <div className="size-14 rounded-full bg-green-100 flex items-center justify-center mb-2 mx-auto">
              <Check className="size-7 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">E-mail enviado</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm max-w-70 mx-auto">
            Se o e-mail informado estiver cadastrado, você receberá um link para
            redefinir sua senha. Verifique também a caixa de spam.
          </DialogDescription>

          <Link
            href="/login"
            className="w-full mt-6 h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center transition-all duration-200"
          >
            Voltar para o login
          </Link>
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
