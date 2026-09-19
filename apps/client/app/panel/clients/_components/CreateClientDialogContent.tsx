'use client';

import { UserPlus } from 'lucide-react';

import { useCreateClientForm } from '../_hooks/useCreateClientForm';

import { DialogContent } from '@/src/components/ui/dialog-form';
import {
  FormDialogFooter,
  FormDialogHeader,
} from '@/src/components/ui/form-dialog-content';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field';

import { Input } from '@/src/components/ui/input';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';

interface ICreateClientDialogContentProps {
  closeDialog: () => void;
}

export default function CreateClientDialogContent({
  closeDialog,
}: ICreateClientDialogContentProps) {
  const { register, handleSubmit, errors, isSubmitting, control } =
    useCreateClientForm({
      closeDialog,
    });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={UserPlus}
        title="Novo Cliente"
        description="Preencha os dados do cliente."
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              placeholder="Nome do cliente"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <PhoneInputField
            id="phone"
            label="Telefone"
            name="phone"
            placeholder="(11) 90000-0000"
            control={control}
            error={errors.phone?.message}
          />

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              placeholder="E-mail do cliente"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
        </FieldGroup>

        <FormDialogFooter submitLabel="Criar" isSubmitting={isSubmitting} />
      </form>
    </DialogContent>
  );
}
