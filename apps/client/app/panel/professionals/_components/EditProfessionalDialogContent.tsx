'use client';

import { UserCog } from 'lucide-react';

import { useEditProfessionalForm } from '../_hooks/useEditProfessionalForm';

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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

interface IEditProfessionalDialogContentProps {
  employeeId: number;
  closeDialog: () => void;
}

export default function EditProfessionalDialogContent({
  employeeId,
  closeDialog,
}: IEditProfessionalDialogContentProps) {
  const { register, handleSubmit, errors, employeeSchedules } =
    useEditProfessionalForm({ employeeId, closeDialog });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={UserCog}
        title="Editar Profissional"
        description="Edite os dados do profissional."
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              placeholder="Nome do profissional"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.employeeScheduleId}>
            <FieldLabel htmlFor="employeeScheduleId">Expediente</FieldLabel>
            <NativeSelect
              id="employeeScheduleId"
              aria-invalid={!!errors.employeeScheduleId}
              {...register('employeeScheduleId')}
            >
              {employeeSchedules.map((employeeSchedule) => (
                <NativeSelectOption
                  key={employeeSchedule.id}
                  value={employeeSchedule.id}
                >
                  {employeeSchedule.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError>{errors.employeeScheduleId?.message}</FieldError>
          </Field>
        </FieldGroup>

        <FormDialogFooter />
      </form>
    </DialogContent>
  );
}
