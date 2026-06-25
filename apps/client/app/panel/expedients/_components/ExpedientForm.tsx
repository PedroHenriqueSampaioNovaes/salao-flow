'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFieldArray } from 'react-hook-form';

import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';

import { useExpedientForm } from '../_hooks/useExpedientForm';
import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

const WEEKDAY_NAMES = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

interface ServiceFormProps {
  onSubmit: (data: EmployeeScheduleSchema) => Promise<void>;
  defaultValues?: Partial<EmployeeScheduleSchema>;
  submitLabel?: string;
}

export function ExpedientForm({
  onSubmit,
  defaultValues,
  submitLabel = 'Salvar',
}: ServiceFormProps) {
  const { register, handleSubmit, control, getValues, errors, watch } =
    useExpedientForm({
      defaultValues,
    });
  const [editingDayId, setEditingDayId] = useState<number | null>(null);
  const { fields } = useFieldArray({
    control,
    name: 'weekdays',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          placeholder="Nome do expediente."
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      {fields.map((field, index) => {
        const isEditing = editingDayId === index;
        const isWorkingDayValue = watch(`weekdays.${index}.isWorkingDay`);

        return (
          <div key={field.id} className="flex items-center gap-4">
            <span className="w-32">{WEEKDAY_NAMES[index]}</span>

            {isEditing ? (
              <>
                <Input
                  type="time"
                  className="w-28"
                  {...register(`weekdays.${index}.start`)}
                  disabled={!isWorkingDayValue}
                />
                <Input
                  type="time"
                  className="w-28"
                  {...register(`weekdays.${index}.startLunch`)}
                  disabled={!isWorkingDayValue}
                />
                <Input
                  type="time"
                  className="w-28"
                  {...register(`weekdays.${index}.endLunch`)}
                  disabled={!isWorkingDayValue}
                />
                <Input
                  type="time"
                  className="w-28"
                  {...register(`weekdays.${index}.end`)}
                  disabled={!isWorkingDayValue}
                />
                <select
                  {...register(`weekdays.${index}.isWorkingDay`, {
                    setValueAs: (value) => {
                      return value === 'true' || value === true;
                    },
                  })}
                  className="w-28"
                >
                  <option value="true">Disponível</option>
                  <option value="false">Indisponível</option>
                </select>
                <button
                  type="button"
                  className="cursor-pointer text-emerald-400 font-semibold"
                  onClick={() => setEditingDayId(null)}
                >
                  FECHAR
                </button>
              </>
            ) : (
              <>
                <span>
                  {getValues(`weekdays.${index}.isWorkingDay`)
                    ? getValues(`weekdays.${index}.start`)
                    : 'Fechado'}
                </span>
                <span>
                  {getValues(`weekdays.${index}.isWorkingDay`)
                    ? getValues(`weekdays.${index}.startLunch`)
                    : 'Fechado'}
                </span>
                <span>
                  {getValues(`weekdays.${index}.isWorkingDay`)
                    ? getValues(`weekdays.${index}.endLunch`)
                    : 'Fechado'}
                </span>
                <span>
                  {getValues(`weekdays.${index}.isWorkingDay`)
                    ? getValues(`weekdays.${index}.end`)
                    : 'Fechado'}
                </span>
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setEditingDayId(index)}
                >
                  CONFIGURAR
                </button>
              </>
            )}
          </div>
        );
      })}

      <div className="flex items-center gap-20">
        <Link
          href="/panel/expedients"
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
