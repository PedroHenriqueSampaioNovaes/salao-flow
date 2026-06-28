'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CreateCustomerSchema,
  createCustomerSchema,
} from '@sistema-barbearia/validators';

interface UseClientFormProps {
  defaultValues?: Partial<CreateCustomerSchema>;
}

export function useClientForm({ defaultValues }: UseClientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      isBlocked: false,
      ...defaultValues,
    },
  });

  return {
    register,
    handleSubmit,
    control,
    errors,
  };
}
