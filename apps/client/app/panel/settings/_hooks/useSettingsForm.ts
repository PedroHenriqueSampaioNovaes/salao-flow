'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  UpdateBarbershopSchema,
  updateBarbershopSchema,
} from '@sistema-barbearia/validators';
import updateBarbershopAction from '@/app/actions/update-barbershop';

import { usePanelContext } from '@/src/common/contexts/panel-context';

export function useSettingsForm() {
  const { barbershop, setBarbershop } = usePanelContext();

  const methods = useForm<UpdateBarbershopSchema>({
    resolver: zodResolver(updateBarbershopSchema),
    defaultValues: {
      name: barbershop?.name || '',
      businessName: barbershop?.businessName || '',
      phone: barbershop?.phone || '',
      email: barbershop?.email || '',
      address: barbershop?.address || '',
      image: barbershop?.image || '',
      slug: barbershop?.slug || '',
      timezone: barbershop?.timezone || '',
      whatsAppUrl: barbershop?.whatsAppUrl || '',
      facebookUrl: barbershop?.facebookUrl || '',
      instagramUrl: barbershop?.instagramUrl || '',
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

  return { methods, onSubmit };
}
