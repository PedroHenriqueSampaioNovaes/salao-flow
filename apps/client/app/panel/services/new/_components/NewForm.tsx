'use client';

import { useRouter } from 'next/navigation';

import createServiceAction from '@/app/actions/create-service';

import { usePanelContext } from '@/src/common/contexts/panel-context';

import { ServiceFormData } from '../../_hooks/useServiceForm';

import { ServiceForm } from '../../_components/ServiceForm';

export default function NewForm() {
  const router = useRouter();

  const { setServices } = usePanelContext();

  async function onSubmit(data: ServiceFormData) {
    const {
      data: serviceResponse,
      ok,
      error,
    } = await createServiceAction({
      ...data,
      duration: Number(data.duration),
      price: data.price * 100,
      employeeIds: data.employeeIds?.map((id) => Number(id)),
    });

    if (!ok) return alert(error);

    setServices((prev) => [...prev, serviceResponse!]);
    router.push('/panel/services');
  }

  return <ServiceForm onSubmit={onSubmit} />;
}
