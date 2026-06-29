'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IBarbershop } from '@/src/common/interfaces/barbershop';

import { UpdateBarbershopSchema } from '@sistema-barbearia/validators';

export default async function updateBarbershopAction(
  barbershopData: UpdateBarbershopSchema,
) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.put<IBarbershop>('/barbershops', {
      token: cookieStore.get('token')?.value,
      body: barbershopData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
