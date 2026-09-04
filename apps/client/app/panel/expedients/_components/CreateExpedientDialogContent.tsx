'use client';

import { CalendarPlus } from 'lucide-react';

import { useCreateExpedientForm } from '../_hooks/useCreateExpedientForm';

import { DialogContent } from '@/src/components/ui/dialog';
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

import { ExpedientWeekdayFields } from './ExpedientWeekdayFields';

interface ICreateExpedientDialogContentProps {
  closeDialog: () => void;
}

export default function CreateExpedientDialogContent({
  closeDialog,
}: ICreateExpedientDialogContentProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    errors,
    isSubmitting,
  } = useCreateExpedientForm({ closeDialog });

  return (
    <DialogContent showCloseButton={false} className="sm:max-w-lg">
      <FormDialogHeader
        Icon={CalendarPlus}
        title="Novo Expediente"
        description="Crie um novo expediente para a sua equipe."
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              placeholder="Nome do expediente"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Dias da semana</FieldLabel>
            <ExpedientWeekdayFields
              control={control}
              register={register}
              watch={watch}
            />
          </Field>
        </FieldGroup>

        <FormDialogFooter submitLabel="Criar" isSubmitting={isSubmitting} />
      </form>
    </DialogContent>
  );
}
