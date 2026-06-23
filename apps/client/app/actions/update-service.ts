'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateService, IService } from '@/src/common/interfaces/service';

export default async function updateServiceAction(
  id: string,
  serviceData: ICreateService,
) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.put<IService>(`/services/${id}`, {
      token: cookieStore.get('token')?.value,
      body: serviceData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
