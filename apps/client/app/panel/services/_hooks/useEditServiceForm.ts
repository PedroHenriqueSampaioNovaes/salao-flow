'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, ServiceSchema } from '@sistema-barbearia/validators';
import { useQueryClient } from '@tanstack/react-query';

import updateServiceAction from '@/app/actions/update-service';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { showErrorToast, showSuccessToast } from '@/src/common/lib/toast';

interface UseEditServiceFormProps {
  serviceId: string;
  closeDialog: () => void;
}

export function useEditServiceForm({
  serviceId,
  closeDialog,
}: UseEditServiceFormProps) {
  const { services, setServices } = usePanelContext();
  const queryClient = useQueryClient();

  const service = services.find((s) => s.id === serviceId);

  const { register, handleSubmit, control, formState } =
    useForm<ServiceSchema>({
      resolver: zodResolver(serviceSchema),
      defaultValues: {
        name: service?.name || '',
        description: service?.description ?? '',
        price: service ? service.price / 100 : 0,
        duration: service?.duration || 0,
        status: service?.status ?? true,
        assignToAllEmployees: service?.assignToAllEmployees ?? true,
        employeeIds: service?.employees.map((employee) => employee.id) ?? [],
      },
    });

  const onSubmit = async (data: ServiceSchema) => {
    if (!service) return;

    const {
      data: serviceUpdated,
      ok,
      error,
    } = await updateServiceAction(service.id, {
      ...data,
      price: data.price * 100,
    });

    if (!ok) {
      showErrorToast(error || 'Erro ao atualizar serviço.');
      return;
    }

    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? serviceUpdated! : s)),
    );

    queryClient.invalidateQueries({ queryKey: ['employees'] });
    showSuccessToast('Serviço atualizado com sucesso!');
    closeDialog();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors: formState.errors,
  };
}
