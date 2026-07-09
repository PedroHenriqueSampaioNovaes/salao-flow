'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { IBarbershop } from '@/src/common/interfaces/barbershop';
import {
  UpdateBarbershopSchema,
  updateBarbershopSchema,
} from '@sistema-barbearia/validators';
import updateBarbershopAction from '@/app/actions/update-barbershop';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export function useSettingsForm() {
  const { barbershop, setBarbershop } = usePanelContext();

  const defaultValues: Partial<IBarbershop> = {
    name: barbershop?.name || '',
    phone: barbershop?.phone || '',
    email: barbershop?.email || '',
    address: barbershop?.address || '',
    image: barbershop?.image || '',
    status: barbershop?.status || false,
    slug: barbershop?.slug || '',
    timezone: barbershop?.timezone || '',
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateBarbershopSchema>({
    resolver: zodResolver(updateBarbershopSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      slug: '',
      password: '',
      currentPassword: '',
      confirmPassword: '',
      ...defaultValues,
    },
  });

  async function onSubmit(data: UpdateBarbershopSchema) {
    if (!barbershop?.name) return;

    const {
      data: barbershopUpdated,
      ok,
      error,
    } = await updateBarbershopAction(data);

    if (!ok) return alert(error);

    setBarbershop((prev) => ({ ...prev, ...barbershopUpdated! }));
  }

  return {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  };
}
