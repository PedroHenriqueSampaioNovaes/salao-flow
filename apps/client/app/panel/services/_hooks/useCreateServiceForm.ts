'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { serviceSchema, ServiceSchema } from '@sistema-barbearia/validators';

import createServiceAction from '@/app/actions/create-service';

import { DASHBOARD_METRICS_QUERY_KEY } from '@/app/panel/dashboard/_components/MetricCards';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

interface UseCreateServiceFormProps {
  closeDialog: () => void;
}

export function useCreateServiceForm({
  closeDialog,
}: UseCreateServiceFormProps) {
  const { setServices } = usePanelContext();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, formState } = useForm<ServiceSchema>(
    {
      resolver: zodResolver(serviceSchema),
      defaultValues: {
        name: '',
        description: '',
        price: 0,
        duration: undefined,
        status: true,
        assignToAllEmployees: true,
        employeeIds: [],
      },
    },
  );

  async function onSubmit(data: ServiceSchema) {
    const {
      data: serviceResponse,
      ok,
      error,
    } = await createServiceAction({
      ...data,
      price: data.price * 100,
    });

    if (!ok) {
      showErrorToast(error || 'Erro ao criar serviço.');
      return;
    }

    setServices((prev) => [...prev, serviceResponse!]);
    queryClient.invalidateQueries({ queryKey: ['employees'] });
    queryClient.invalidateQueries({ queryKey: DASHBOARD_METRICS_QUERY_KEY });

    showSuccessToast('Serviço criado com sucesso!');
    closeDialog();
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
  };
}
