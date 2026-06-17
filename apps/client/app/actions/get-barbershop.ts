'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IBarbershop } from '@/src/common/interfaces/barbershop';

export default async function getBarbershopAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IBarbershop>('/barbershops/me', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
