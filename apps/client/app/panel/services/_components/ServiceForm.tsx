'use client';

import Link from 'next/link';
import { Controller, useWatch } from 'react-hook-form';

import { ServiceFormData, useServiceForm } from '../_hooks/useServiceForm';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { MultiSelect } from '@/src/components/ui/multi-select';
import { Switch } from '@/src/components/ui/switch';
import { Textarea } from '@/src/components/ui/textarea';
import { InputCurrencyMask } from '@/src/components/ui/input-currency-mask';

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => Promise<void>;
  defaultValues?: Partial<ServiceFormData>;
  submitLabel?: string;
}

export function ServiceForm({
  onSubmit,
  defaultValues,
  submitLabel = 'Salvar',
}: ServiceFormProps) {
  const { register, handleSubmit, control, errors } = useServiceForm({
    defaultValues,
  });

  const { employees } = usePanelContext();

  const assignToAllEmployees = useWatch({
    control,
    name: 'assignToAllEmployees',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Nome</FieldLabel>
        <Input
          id="name"
          placeholder="Nome do serviço."
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <InputCurrencyMask
        label="Preço"
        name="price"
        control={control}
        error={errors.price?.message}
      />

      <Field data-invalid={!!errors.duration}>
        <FieldLabel htmlFor="duration">Tempo (em minutos)</FieldLabel>
        <Input
          id="duration"
          placeholder="Duração do serviço."
          aria-invalid={!!errors.duration}
          type="number"
          min={0}
          {...register('duration')}
        />
        <FieldError>{errors.duration?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.description}>
        <FieldLabel htmlFor="description">Descrição (opcional)</FieldLabel>
        <Textarea
          id="description"
          placeholder="Descrição do serviço."
          aria-invalid={!!errors.description}
          {...register('description')}
          maxLength={130}
        />
        <FieldError>{errors.description?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.status}>
        <FieldLabel htmlFor="status">Serviço disponível</FieldLabel>
        <FieldDescription>
          Quando desativado, o serviço não aparecerá na agenda
        </FieldDescription>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Switch
              id="status"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <FieldError>{errors.status?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.assignToAllEmployees}>
        <FieldLabel htmlFor="assignToAllEmployees">
          Aplicar para todos os funcionários
        </FieldLabel>
        <Controller
          name="assignToAllEmployees"
          control={control}
          render={({ field }) => (
            <Switch
              id="assignToAllEmployees"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <FieldError>{errors.assignToAllEmployees?.message}</FieldError>
      </Field>

      {!assignToAllEmployees && (
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
                selected={field.value ?? []}
                onChange={field.onChange}
                placeholder="Selecione os profissionais..."
                ariaInvalid={!!errors.employeeIds}
              />
            )}
          />
          <FieldError>{errors.employeeIds?.message}</FieldError>
        </Field>
      )}

      <div className="flex items-center gap-20">
        <Link
          href="/panel/services"
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
