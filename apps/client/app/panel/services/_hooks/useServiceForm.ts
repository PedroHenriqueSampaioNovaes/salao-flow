'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const serviceFormSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    price: z.number().min(0.01, 'Preço é obrigatório'),
    description: z.string().optional(),
    duration: z.string().min(1, 'Duração é obrigatória'),
    status: z.boolean(),
    assignToAllEmployees: z.boolean(),
    employeeIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.assignToAllEmployees) return true;
      return !!data.employeeIds && data.employeeIds.length > 0;
    },
    {
      message: 'Selecione ao menos um funcionário para atribuir o serviço',
      path: ['employeeIds'],
    },
  );

export type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface UseProfessionalFormProps {
  defaultValues?: Partial<ServiceFormData>;
}

export function useServiceForm({ defaultValues }: UseProfessionalFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      duration: '',
      description: '',
      status: true,
      assignToAllEmployees: true,
      price: 0,
      ...defaultValues,
      employeeIds: defaultValues?.assignToAllEmployees
        ? []
        : (defaultValues?.employeeIds ?? []),
    },
  });

  return {
    register,
    handleSubmit,
    control,
    errors,
  };
}
