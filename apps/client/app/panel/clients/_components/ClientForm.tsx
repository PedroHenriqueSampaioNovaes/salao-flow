'use client';

import Link from 'next/link';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';

import { CreateCustomerSchema } from '@sistema-barbearia/validators';

import { useClientForm } from '../_hooks/useClientForm';

import { PhoneInputField } from '@/app/(auth)/register/_components/PhoneInputField';

interface ClientFormProps {
  onSubmit: (data: CreateCustomerSchema) => Promise<void>;
  defaultValues?: Partial<CreateCustomerSchema>;
  submitLabel?: string;
}

export function ClientForm({
  onSubmit,
  defaultValues,
  submitLabel = 'Salvar',
}: ClientFormProps) {
  const { register, handleSubmit, control, errors } = useClientForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          placeholder="Nome do cliente."
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <PhoneInputField
        id="phone"
        label="Telefone"
        name="phone"
        control={control}
        error={errors.phone?.message}
      />

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

      <div className="flex items-center gap-20">
        <Link
          href="/panel/clients"
          className="block text-center w-full text-amber-500 font-semibold py-3 px-4 rounded-lg hover:text-amber-400 transition-colors"
        >
          Voltar
        </Link>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
