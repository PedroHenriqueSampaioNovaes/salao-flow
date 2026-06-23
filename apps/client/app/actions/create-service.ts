'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { ICreateService, IService } from '@/src/common/interfaces/service';

export default async function createServiceAction(serviceData: ICreateService) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const data = await FetchApi.post<IService>('/services', {
      token,
      body: serviceData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
