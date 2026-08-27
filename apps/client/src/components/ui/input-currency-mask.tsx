'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';
import { CurrencyInput } from 'react-currency-mask';

import { Input } from '@/src/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/src/components/ui/field';

interface PhoneInputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  error?: string;
  id?: string;
  placeholder?: string;
  Icon?: LucideIcon;
  className?: string;
}

export function InputCurrencyMask<
  TFieldValues extends FieldValues = FieldValues,
>({
  label,
  name,
  control,
  error,
  id = 'currency',
  placeholder,
  Icon,
  className,
}: PhoneInputFieldProps<TFieldValues>) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id} Icon={Icon}>
        {label}
      </FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <CurrencyInput
            {...fieldProps}
            value={value}
            defaultValue="0,00"
            onChangeValue={(_, val) => {
              onChange(val);
            }}
            InputElement={<Input />}
            className={className}
            id={id}
            placeholder={placeholder}
            aria-invalid={!!error}
          />
        )}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
