'use client';

import Link from 'next/link';

import { Controller } from 'react-hook-form';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { MultiSelect } from '@/src/components/ui/multi-select';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import {
  CreateScheduleBlockFormData,
  useBlockedTimesForm,
} from '../_hooks/useBlockedTimesForm';

interface BlockedTimesFormProps {
  onSubmit: (data: CreateScheduleBlockFormData) => Promise<void>;
  defaultValues?: Partial<CreateScheduleBlockFormData>;
  submitLabel?: string;
}

export function BlockedTimesForm({
  onSubmit,
  defaultValues,
  submitLabel = 'Salvar',
}: BlockedTimesFormProps) {
  const { register, handleSubmit, control, errors } = useBlockedTimesForm({
    defaultValues,
  });

  const { employees } = usePanelContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome do bloqueio</FieldLabel>
        <Input
          id="name"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.initialDate}>
        <FieldLabel htmlFor="initialDate">Data inicial</FieldLabel>
        <Input
          id="initialDate"
          type="date"
          aria-invalid={!!errors.initialDate}
          {...register('initialDate')}
        />
        <FieldError>{errors.initialDate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.initialDate}>
        <FieldLabel htmlFor="initialTime">Horário inicial</FieldLabel>
        <Input
          id="initialTime"
          type="time"
          aria-invalid={!!errors.initialTime}
          {...register('initialTime')}
        />
        <FieldError>{errors.initialTime?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.finalDate}>
        <FieldLabel htmlFor="finalDate">Data final</FieldLabel>
        <Input
          id="finalDate"
          type="date"
          aria-invalid={!!errors.finalDate}
          {...register('finalDate')}
        />
        <FieldError>{errors.finalDate?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.finalTime}>
        <FieldLabel htmlFor="finalTime">Horário final</FieldLabel>
        <Input
          id="finalTime"
          type="time"
          aria-invalid={!!errors.finalTime}
          {...register('finalTime')}
        />
        <FieldError>{errors.finalTime?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.employeeIds}>
        <FieldLabel htmlFor="profissionals">Profissionais</FieldLabel>
        <Controller
          name="employeeIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              id="profissionals"
              options={employees.map((emp) => ({
                value: String(emp.id),
                label: emp.name,
              }))}
              selected={field.value ?? []}
              onChange={field.onChange}
              placeholder="Selecione os profissionais..."
              ariaInvalid={!!errors.employeeIds}
            />
          )}
        />
        <FieldError>{errors.employeeIds?.message}</FieldError>
      </Field>

      <div className="flex items-center gap-20">
        <Link
          href="/panel/blocked-times"
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
