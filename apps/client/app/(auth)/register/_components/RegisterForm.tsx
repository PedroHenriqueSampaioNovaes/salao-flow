'use client';

import Link from 'next/link';

import { useRegisterForm } from '../_hooks/useRegisterForm';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';
import FormButton from '@/src/components/ui/form-button';

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    error,
    errors,
    isSubmitting,
    onSubmit,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_1px_3px_rgba(73,81,93,0.2)]">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <h1 className="text-center text-2xl font-bold text-tertiary leading-none">
          Criar conta
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <Field className="col-span-2" data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name" className="font-bold text-primary">
              Seu nome
            </FieldLabel>
            <Input
              id="name"
              placeholder="Ex.: Carlos da Silva"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field className="col-span-2" data-invalid={!!errors.businessName}>
            <FieldLabel
              htmlFor="businessName"
              className="font-bold text-primary"
            >
              Nome do estabelecimento
            </FieldLabel>
            <Input
              id="businessName"
              placeholder="Ex.: Carlos Studio"
              aria-invalid={!!errors.businessName}
              {...register('businessName')}
            />
            <FieldError>{errors.businessName?.message}</FieldError>
          </Field>

          <Field className="max-md:col-span-2" data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className="font-bold text-primary">
              E-mail
            </FieldLabel>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              placeholder="Ex.: carlos@email.com"
              {...register('email')}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <div className="max-md:col-span-2">
            <PhoneInputField
              id="phone"
              label="Telefone"
              name="phone"
              control={control}
              error={errors.phone?.message}
              placeholder="Ex.: (11) 91111-1111"
            />
          </div>

          <Field className="col-span-2" data-invalid={!!errors.address}>
            <FieldLabel htmlFor="address" className="font-bold text-primary">
              Endereço
            </FieldLabel>
            <Input
              id="address"
              placeholder="Ex.: Rua das Palmeiras, 120 - São Paulo"
              aria-invalid={!!errors.address}
              {...register('address')}
            />
            <FieldError>{errors.address?.message}</FieldError>
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

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel
              htmlFor="confirmPassword"
              className="font-bold text-primary"
            >
              Confirmar senha
            </FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            <FieldError>{errors.confirmPassword?.message}</FieldError>
          </Field>
        </div>

        {error && (
          <span role="alert" className="input-error-message">
            {error}
          </span>
        )}

        <FormButton isSubmitting={isSubmitting}>Cadastrar</FormButton>

        <div className="flex justify-center text-sm text-primary">
          Já tem conta?
          <Link href="/login" className="link ml-1">
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
