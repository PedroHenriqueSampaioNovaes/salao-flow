'use client';

import { CalendarPlus } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { useCreateBlockedTimeForm } from '../_hooks/useCreateBlockedTimeForm';

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
import { MultiSelect } from '@/src/components/ui/multi-select';

interface ICreateBlockedTimeDialogContentProps {
  closeDialog: () => void;
}

export default function CreateBlockedTimeDialogContent({
  closeDialog,
}: ICreateBlockedTimeDialogContentProps) {
  const { register, handleSubmit, errors, control, employees } =
    useCreateBlockedTimeForm({ closeDialog });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={CalendarPlus}
        title="Novo bloqueio"
        description="Preencha os dados do bloqueio."
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="customer-name">Nome do bloqueio</FieldLabel>
            <Input
              id="customer-name"
              aria-invalid={!!errors.name}
              placeholder="Ex: Folga, Problema Pessoal, etc."
              {...register('name')}
            />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.employeeIds}>
            <FieldLabel htmlFor="professionals">Profissionais</FieldLabel>
            <Controller
              name="employeeIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  id="professionals"
                  options={employees.map((emp) => ({
                    value: String(emp.id),
                    label: emp.name,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione os profissionais..."
                  ariaInvalid={!!errors.employeeIds}
                />
              )}
            />
            <FieldError>{errors.employeeIds?.message}</FieldError>
          </Field>

          <div className="flex items-end gap-2.5">
            <Field data-invalid={!!errors.initialDate}>
              <FieldLabel htmlFor="initialDate">Início</FieldLabel>
              <Input
                id="initialDate"
                type="date"
                aria-invalid={!!errors.initialDate}
                {...register('initialDate')}
              />
              <FieldError>{errors.initialDate?.message}</FieldError>
            </Field>
            <Field data-invalid={!!errors.initialTime}>
              <FieldLabel htmlFor="initialTime">
                <Input
                  id="initialTime"
                  type="time"
                  aria-invalid={!!errors.initialTime}
                  {...register('initialTime')}
                />
              </FieldLabel>
              <FieldError>{errors.initialTime?.message}</FieldError>
            </Field>
          </div>

          <div className="flex items-end gap-2.5">
            <Field data-invalid={!!errors.finalDate}>
              <FieldLabel htmlFor="finalDate">Fim</FieldLabel>
              <Input
                id="finalDate"
                type="date"
                aria-invalid={!!errors.finalDate}
                {...register('finalDate')}
              />
              <FieldError>{errors.finalDate?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.finalTime}>
              <FieldLabel htmlFor="finalTime">
                <Input
                  id="finalTime"
                  type="time"
                  aria-invalid={!!errors.finalTime}
                  {...register('finalTime')}
                />
              </FieldLabel>
              <FieldError>{errors.finalTime?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>

        <FormDialogFooter submitLabel="Criar" />
      </form>
    </DialogContent>
  );
}
