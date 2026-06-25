'use server';

import { cookies } from 'next/headers';

import FetchApi from '@/src/common/api/FetchApi';

import { apiError } from '@/src/common/utils/apiError';

import { IExpedient, IUpdateExpedient } from '@/src/common/interfaces/employee';

export default async function updateExpedientAction(
  id: string,
  expedientData: IUpdateExpedient,
) {
  try {
    const cookieStore = await cookies();

    const data = await FetchApi.put<IExpedient>(`/employee-schedules/${id}`, {
      token: cookieStore.get('token')?.value,
      body: expedientData,
    });

    return { data, ok: true, error: '' };
  } catch (error) {
    return apiError(error);
  }
}
