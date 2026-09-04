'use client';

import { Ban, UserCog } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { useEditClientForm } from '../_hooks/useEditClientForm';

import { DialogContent } from '@/src/components/ui/dialog';
import {
  FormDialogFooter,
  FormDialogHeader,
} from '@/src/components/ui/form-dialog-content';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/src/components/ui/field';

import { Input } from '@/src/components/ui/input';
import { PhoneInputField } from '@/src/components/ui/phone-input-field';
import { Checkbox } from '@/src/components/ui/checkbox';

interface IEditClientDialogContentProps {
  clientId: number;
  closeDialog: () => void;
}

export default function EditClientDialogContent({
  clientId,
  closeDialog,
}: IEditClientDialogContentProps) {
  const { register, handleSubmit, errors, isSubmitting, control } =
    useEditClientForm({
      clientId,
      closeDialog,
    });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={UserCog}
        title="Editar Cliente"
        description="Edite os dados do cliente."
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

          <Field data-invalid={!!errors.isBlocked}>
            <FieldLabel className="cursor-pointer">
              <Field
                orientation="horizontal"
                className="flex items-center! py-2! px-3!"
              >
                <Ban className="size-4" />
                <FieldContent className="gap-0">
                  <FieldTitle>Bloquear Cliente</FieldTitle>
                  <FieldDescription>Impede novos agendamentos</FieldDescription>
                </FieldContent>
                <Controller
                  name="isBlocked"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="isBlocked"
                      className="cursor-pointer"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  )}
                />
              </Field>
            </FieldLabel>
            <FieldError>{errors.isBlocked?.message}</FieldError>
          </Field>
        </FieldGroup>

        <FormDialogFooter isSubmitting={isSubmitting} />
      </form>
    </DialogContent>
  );
}
