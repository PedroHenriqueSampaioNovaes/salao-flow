'use client';

import Link from 'next/link';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select';

import { IEmployeeSchedule } from '@/src/common/interfaces/employee-schedule';
import {
  ProfessionalFormData,
  useProfessionalForm,
} from '../_hooks/useProfessionalForm';

interface ProfessionalFormProps {
  employeeSchedules: IEmployeeSchedule[];
  onSubmit: (data: ProfessionalFormData) => Promise<void>;
  defaultValues?: Partial<ProfessionalFormData>;
  submitLabel?: string;
}

export function ProfessionalForm({
  employeeSchedules,
  onSubmit,
  defaultValues,
  submitLabel = 'Salvar',
}: ProfessionalFormProps) {
  const { register, handleSubmit, errors, defaultEmployeeSchedule } =
    useProfessionalForm({ employeeSchedules, defaultValues });

  const scheduleId =
    defaultValues?.employeeScheduleId || defaultEmployeeSchedule?.id;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.image}>
        <FieldLabel htmlFor="image">Foto</FieldLabel>
        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          aria-invalid={!!errors.image}
        />
        <input type="hidden" {...register('image')} />
        <FieldError>{errors.image?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          placeholder="Nome do funcionário"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.employeeScheduleId}>
        <FieldLabel htmlFor="expediente">Expediente</FieldLabel>
        <NativeSelect
          id="expediente"
          aria-invalid={!!errors.employeeScheduleId}
          {...register('employeeScheduleId')}
          defaultValue={scheduleId}
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

      <div className="flex items-center gap-20">
        <Link
          href="/panel/professionals"
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
