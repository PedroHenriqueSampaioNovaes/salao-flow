'use client';

import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { IMaskMixin } from 'react-imask';
import { LucideIcon } from 'lucide-react';

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

const MaskedInput = IMaskMixin(({ inputRef, className, ...props }) => (
  <Input
    {...props}
    ref={inputRef as React.Ref<HTMLInputElement>}
    className={className}
  />
));

export function PhoneInputField<
  TFieldValues extends FieldValues = FieldValues,
>({
  label,
  name,
  control,
  error,
  id = 'phone',
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
        render={({ field: { ref, onChange, value, ...fieldProps } }) => (
          <MaskedInput
            {...fieldProps}
            inputRef={ref}
            mask={[{ mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' }]}
            value={value}
            onAccept={(val: string) => onChange(val)}
            id={id}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={className}
          />
        )}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
