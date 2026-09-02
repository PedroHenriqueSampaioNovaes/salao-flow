'use client';

import { Settings2 } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';

import { useEditServiceForm } from '../_hooks/useEditServiceForm';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { DialogContent } from '@/src/components/ui/dialog';
import {
  FormDialogFooter,
  FormDialogHeader,
} from '@/src/components/ui/form-dialog-content';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Switch } from '@/src/components/ui/switch';
import { MultiSelect } from '@/src/components/ui/multi-select';
import { InputCurrencyMask } from '@/src/components/ui/input-currency-mask';

interface IEditServiceDialogContentProps {
  serviceId: string;
  closeDialog: () => void;
}

export default function EditServiceDialogContent({
  serviceId,
  closeDialog,
}: IEditServiceDialogContentProps) {
  const { register, handleSubmit, control, errors } = useEditServiceForm({
    serviceId,
    closeDialog,
  });

  const { employees } = usePanelContext();

  const assignToAllEmployees = useWatch({
    control,
    name: 'assignToAllEmployees',
  });

  return (
    <DialogContent showCloseButton={false}>
      <FormDialogHeader
        Icon={Settings2}
        title="Editar Serviço"
        description="Edite os dados do serviço."
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              placeholder="Nome do serviço"
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
              placeholder="Duração do serviço"
              aria-invalid={!!errors.duration}
              type="number"
              min={0}
              {...register('duration', { valueAsNumber: true })}
            />
            <FieldError>{errors.duration?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Descrição (opcional)</FieldLabel>
            <Textarea
              id="description"
              placeholder="Descrição do serviço"
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
              Aplicar para todos os profissionais
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
                    options={employees.map((employee) => ({
                      value: String(employee.id),
                      label: employee.name,
                    }))}
                    selected={(field.value ?? []).map(String)}
                    onChange={(values) => field.onChange(values.map(Number))}
                    placeholder="Selecione os profissionais..."
                    ariaInvalid={!!errors.employeeIds}
                  />
                )}
              />
              <FieldError>{errors.employeeIds?.message}</FieldError>
            </Field>
          )}
        </FieldGroup>

        <FormDialogFooter />
      </form>
    </DialogContent>
  );
}
