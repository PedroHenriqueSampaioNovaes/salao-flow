'use client';

import { CalendarCog } from 'lucide-react';

import { useEditExpedientForm } from '../_hooks/useEditExpedientForm';

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

import { ExpedientWeekdayFields } from './ExpedientWeekdayFields';

interface IEditExpedientDialogContentProps {
  expedientId: string;
  closeDialog: () => void;
}

export default function EditExpedientDialogContent({
  expedientId,
  closeDialog,
}: IEditExpedientDialogContentProps) {
  const { register, handleSubmit, control, watch, errors, isSubmitting } =
    useEditExpedientForm({ expedientId, closeDialog });

  return (
    <DialogContent showCloseButton={false} className="sm:max-w-lg">
      <FormDialogHeader
        Icon={CalendarCog}
        title="Editar Expediente"
        description="Edite os dados do expediente."
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

        <FormDialogFooter isSubmitting={isSubmitting} />
      </form>
    </DialogContent>
  );
}
