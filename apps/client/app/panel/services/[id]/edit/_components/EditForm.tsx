'use client';

import { useRouter } from 'next/navigation';

import updateServiceAction from '@/app/actions/update-service';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { ServiceForm } from '../../../_components/ServiceForm';
import { ServiceFormData } from '../../../_hooks/useServiceForm';

interface IEditFormProps {
  serviceId: string;
}

export default function EditForm({ serviceId }: IEditFormProps) {
  const { services, setServices } = usePanelContext();

  const service = services.find((e) => e.id === serviceId);

  const router = useRouter();

  if (!service) {
    return <h1>Serviço não encontrado</h1>;
  }

  async function onSubmit(data: ServiceFormData) {
    if (!service) return;

    const {
      data: serviceUpdated,
      ok,
      error,
    } = await updateServiceAction(service.id, {
      ...data,
      duration: Number(data.duration),
      price: data.price * 100,
      employeeIds: data.employeeIds?.map((id) => Number(id)),
    });

    if (!ok) return alert(error);

    setServices((prev) =>
      prev.map((e) => (e.id === service.id ? serviceUpdated! : e)),
    );

    router.push('/panel/services');
  }

  return (
    <ServiceForm
      onSubmit={onSubmit}
      submitLabel="Editar"
      defaultValues={{
        name: service.name,
        price: service.price / 100,
        duration: String(service.duration),
        status: service.status,
        assignToAllEmployees: service.assignToAllEmployees,
        employeeIds: service.employees.map((e) => String(e.id)),
        description: service.description ?? '',
      }}
    />
  );
}
