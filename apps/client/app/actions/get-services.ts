'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IService } from '@/src/common/interfaces/service';

export default async function getServicesAction() {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.get<IService[]>('/services', {
      token: cookieStore.get('token')?.value,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
