'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';

import { useCreateProfessionalForm } from '../_hooks/useCreateProfessionalForm';

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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

interface ICreateProfessionalDialogContentProps {
  closeDialog: () => void;
}

export default function CreateProfessionalDialogContent({
  closeDialog,
}: ICreateProfessionalDialogContentProps) {
  const { register, handleSubmit, errors, isSubmitting, employeeSchedules } =
    useCreateProfessionalForm({ closeDialog });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={UserPlus}
        title="Novo Profissional"
        description="Preencha os dados do profissional."
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

          <p className="text-left text-sm leading-normal font-normal text-primary">
            A criação de serviços está disponível em{' '}
            <Link href="/panel/services" className="link">
              serviços
            </Link>
            .
          </p>
        </FieldGroup>

        <FormDialogFooter submitLabel="Criar" isSubmitting={isSubmitting} />
      </form>
    </DialogContent>
  );
}
